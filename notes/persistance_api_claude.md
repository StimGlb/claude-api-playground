1. Architecture en couches
// Structure recommandée
API Routes → Controllers → Services → Repository → Database
2. Couche Repository Pattern
// userRepository.js
class UserRepository {
  async findById(id) {
    return await db.users.findByPk(id);
  }
  
  async create(userData) {
    return await db.users.create(userData);
  }
  
  async update(id, userData) {
    return await db.users.update(userData, { where: { id } });
  }
  
  async delete(id) {
    return await db.users.destroy({ where: { id } });
  }
}
3. Service Layer
// userService.js
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  async createUser(userData) {
    // Logique métier
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
  }
}
4. Controllers API
// userController.js
class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  
  async create(req, res) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
5. Configuration base de données
// database/config.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD
