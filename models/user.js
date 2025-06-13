const pool = require('../config/db');
const bcrypt = require('bcrypt');
const Ajv = require('ajv');
// plugin nhận diện format: email, date, uri, uuid ( format ko hỗ trợ sẵn trong ajv )
const addFormats = require('ajv-formats');

// allErrors: true tức là thu thập TẤT CẢ LỖI rồi mới trả về thay vì stop lại luôn khi gặp lỗi
const ajv = new Ajv({ allErrors: true });

// gắn plugin vào để thêm format
addFormats(ajv);

const createUserSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255
    },
    name_account: {
      type: 'string',
      minLength: 2,
      maxLength: 100,
      pattern: '^[a-zA-Z0-9\\s_-]+$' // cho phép chữ, số , ký tự , _ , - 
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 100
    },
    date_of_birth: {
      type: 'string',
      format: 'date' // theo format YYYY-MM-DD 
    },
    address: {
      type: 'string',
      maxLength: 500
    }
  },
  required: ['email', 'name_account', 'password'],
  additionalProperties: false // không cho phép trường nào khác ngoài các trường trên
};

const updateUserSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255
    },
    name_account: {
      type: 'string',
      minLength: 2,
      maxLength: 100,
      pattern: '^[a-zA-Z0-9\\s_-]+$'
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 100
    },
    date_of_birth: {
      type: 'string',
      format: 'date'
    },
    address: {
      type: 'string',
      maxLength: 500
    },
    search_distance: {
      type: 'number',
      minimum: 1,
      maximum: 1000
    }
  },
  additionalProperties: false,
  minProperties: 1 // phải có ít nhất 1 field để update
};


const findOneSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    id: {
      type: 'integer',
      minimum: 1
    }
  },
  additionalProperties: false,
  // phải có ít nhất 1 trong 2 trường
  anyOf: [
    { required: ['email'] },
    { required: ['id'] }
  ]
};

// Compile validators trả về 1 hàm validate để dùng
const validateCreateUser = ajv.compile(createUserSchema);
const validateUpdateUser = ajv.compile(updateUserSchema);
const validateFindOne = ajv.compile(findOneSchema);

class User {
  // Helper method để format validation errors
  static formatValidationErrors(errors) {
    return errors.map(error => {
      const field = error.instancePath ? error.instancePath.substring(1) : error.params?.missingProperty || 'root';
      return `${field}: ${error.message}`;
    }).join(', ');
  }

  static async findOne(condition) {
    try {
      // Validate input
      const valid = validateFindOne(condition);

      // Hàm validate trả về true/false
      if (!valid) {
        const errorMessage = this.formatValidationErrors(validateFindOne.errors);
        throw new Error(`Invalid search condition: ${errorMessage}`);
      }

      let query, params;
      
      if (condition.email) {
        query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
        params = [condition.email]; 
      } else if (condition.id) {
        query = 'SELECT * FROM users WHERE id = ? LIMIT 1';
        params = [condition.id];
      } else {
        return null;
      }
      
      const [rows] = await pool.execute(query, params);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
  
  static async findById(id) {
    // Validate id
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid user ID: must be a positive integer');
    }
    return this.findOne({ id });
  }
  
  static async create(userData) {
    try {
      // Validate input data
      const valid = validateCreateUser(userData);
      if (!valid) {
        const errorMessage = this.formatValidationErrors(validateCreateUser.errors);
        throw new Error(`Validation failed: ${errorMessage}`);
      }

      // Check if email already exists
      const existingUser = await this.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const query = `
        INSERT INTO users (email, name_account, password, date_of_birth, address) 
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.execute(query, [
        userData.email,
        userData.name_account,
        hashedPassword,
        userData.date_of_birth || null,
        userData.address || null
      ]);
      
      if (result.insertId) {
        return {
          _id: result.insertId,
          ...userData,
          password: undefined
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  static async comparePassword(user, candidatePassword) {
    if (!user || !user.password) {
      throw new Error('Invalid user or password data');
    }
    
    if (!candidatePassword || typeof candidatePassword !== 'string') {
      throw new Error('Invalid candidate password');
    }
    
    return await bcrypt.compare(candidatePassword, user.password);
  }

  static async updateInfo(userId, updateData) {
    try {
      // Validate userId
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid user ID: must be a positive integer');
      }

      // Validate update data
      const valid = validateUpdateUser(updateData);
      if (!valid) {
        const errorMessage = this.formatValidationErrors(validateUpdateUser.errors);
        throw new Error(`Validation failed: ${errorMessage}`);
      }

      // Check if email already exists (if email is being updated)
      if (updateData.email) {
        const existingUser = await this.findOne({ email: updateData.email });
        if (existingUser && existingUser.id !== userId) {
          throw new Error('Email already exists');
        }
      }

      const allowedFields = ['name_account', 'email', 'date_of_birth', 'address', 'search_distance'];
      const updateFields = [];
      const values = [];

      if (updateData.password) {
        const hashedPassword = await bcrypt.hash(updateData.password, 10);
        updateFields.push('password = ?');
        values.push(hashedPassword);
      }

      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          values.push(updateData[field]);
        }
      }

      if (updateFields.length === 0) {
        return { updated: false, message: 'No fields to update' };
      }

      values.push(userId);
      
      const query = `
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;
      
      const [result] = await pool.execute(query, values);
      
      if (result.affectedRows > 0) {
        const updatedUser = await this.findById(userId);
        return {
          updated: true,
          user: {
            ...updatedUser,
            password: undefined
          }
        };
      }
      
      return { updated: false, message: 'User not found or no changes made' };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // validate dữ liệu trước khi xử lý
  static validateCreateData(data) {
    const valid = validateCreateUser(data);
    if (!valid) {
      return {
        isValid: false,
        errors: this.formatValidationErrors(validateCreateUser.errors)
      };
    }
    return { isValid: true };
  }

  static validateUpdateData(data) {
    const valid = validateUpdateUser(data);
    if (!valid) {
      return {
        isValid: false,
        errors: this.formatValidationErrors(validateUpdateUser.errors)
      };
    }
    return { isValid: true };
  }
}

module.exports = User;