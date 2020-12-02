import express from 'express'
import bodyParser from 'body-parser'
import connection from './database/connection'
import session from 'express-session'
import categoriesController from './categories/categoriesController'
import articlesController from './articles/articlesController'
import usersController from './users/usersConstroller'
import Article from './articles/Article'
import Category from './categories/Category'
import User from './users/usersConstroller'
const app = express()


//view engine

app.set('view engine', 'ejs')

app.use(session({
    secret: 'aleatorio',
    cookie: { maxAge: 30000000 }
}))

//body-parser

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//static

app.use(express.static('public'))

//database

connection.authenticate().then(() => {
    console.log('Conexao feita com sucesso !')
}).catch(error => console.log(error))

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.get('/session', (req, res) => {
    req.session.treinamento = 'parara ieie'
    req.session.ano = 2019
    req.session.email = 'gabriel.pr@hotmail.com'
    res.send('oi fia')
})

app.get('/leitura', (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email
    })
})

//rota pra listar os artigos
app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories })
        })
    })
})

//rota pra obter o artigo
app.get('/:slug', (req, res) => {
    var slug = req.params.slug

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', { article: article, categories: categories })
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

//rota pra filtrar artigos por categoria
app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', { articles: category.articles, categories: categories })
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})


app.listen(8080, () => {
    console.log('App rodando na porta 8080!')
})