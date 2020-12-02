import express from 'express'
import Category from '../categories/Category'
import Article from './Article'
import slugify from 'slugify'
import adminAuth from '../middlewares/adminAuth'

const router = express.Router()

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category, required: true }],
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        res.render('admin/articles/index', { articles: articles })
    })
})

//rota pra listar artigos
router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', { categories: categories })
    })

})

//rota cadastar artigos
router.post('/articles/save', adminAuth, (req, res) => {
    let titleArticle = req.body.title
    let body = req.body.body
    let category = req.body.category

    if (titleArticle != undefined) {
        Article.create({
            title: titleArticle,
            slug: slugify(titleArticle),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect('/admin/articles')
    }
})

//rota pra editar artigo
router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.redirect('/admin/articles')
    }


    Article.findByPk(id).then(article => {

        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { article: article, categories: categories })
            })
        } else {
            res.redirect('/admin/articles')
        }
    }).catch(err => {
        res.redirect('/admin/articles')
    })
})

//rota pra atualizar o artigo
router.post('/articles/update', adminAuth, (req, res) => {
    let id = req.body.id
    let titleArticle = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.update({
        title: titleArticle,
        slug: slugify(titleArticle),
        body: body,
        categoryId: category
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    })

})

//rota pra deletar algum dado
router.post('/articles/delete', adminAuth, (req, res) => {
    let id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) { //Verificando se É numero
            //destroy = metodo para excluir dados.
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })
        } else {
            res.redirect('/admin/articles')
        }
    } else {
        res.redirect('/admin/articles')
    }
})

//rota pra paginação
router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num
    let offset = 0

    if (isNaN(page) || page == 1) {
        offset = 0
    } else {
        offset = (parseInt(page) - 1) * 4
    }


    Article.findAndCountAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4,
        offset: offset,
    }).then(articles => {
        let next
        if (offset + 4 > articles.count) {
            next = false
        } else {
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', { result: result, categories: categories })
        })


    })
})

export default router