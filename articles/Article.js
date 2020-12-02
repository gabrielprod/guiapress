//Model
import Sequelize from 'sequelize'
import connection from '../database/connection'
import Category from '../categories/Category'

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//RELACIOANDO as tabelas
Category.hasMany(Article) //Tem muitos
Article.belongsTo(Category) //Pertence á




export default Article;