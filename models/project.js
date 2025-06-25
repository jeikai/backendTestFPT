const pool = require('../config/db');

class Project {
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM projects');
      return rows;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid project ID');
      }
      const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ? LIMIT 1', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const { name, category, description, technologies, link, status, year } = data;

      const query = `
        INSERT INTO projects (name, category, description, technologies, link, status, year)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(query, [
        name,
        category,
        description,
        technologies,
        link,
        status,
        year
      ]);

      return { id: result.insertId, ...data };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const fields = [];
      const values = [];

      const allowedFields = ['name', 'category', 'description', 'technologies', 'link', 'status', 'year'];

      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          fields.push(`${field} = ?`);
          values.push(data[field]);
        }
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);

      const query = `
        UPDATE projects
        SET ${fields.join(', ')}
        WHERE id = ?
      `;

      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

module.exports = Project;
