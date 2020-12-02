import express, { response } from 'express'
import Category from './Category'
import slugify from 'slugify'
import adminAuth from '../middlewares/adminAuth'
const router = express.Router()

//rota pra criar uma categoria
router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new.ejs')
})

//rota pra adicionar as categorias no banco

router.post('/categories/save', adminAuth, (req, res) => {
    let title = req.body.title
        // verifica se o title nao esta undefined
    if (title != undefined) {
        //adicionando no banco de dados
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {

            res.redirect('/admin/categories')
        })


    } else {
        res.redirect('/admin/categories/new')
    }
})

//rota pra listar dados
router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll({
        raw: true
    }).then(response => {
        res.render('admin/categories/index', {
            ctgs: response
        })
    })
})

//rota pra deletar algum dado
router.post('/categories/delete', adminAuth, (req, res) => {
    let id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) { //Verificando se É numero
            //destroy = metodo para excluir dados.
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories')
            })
        } else {
            res.redirect('/admin/categories')
        }
    } else {
        res.redirect('/admin/categories')
    }
})

//rota pra edicao de dados
router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.redirect('/admin/categories')
    }

    Category.findByPk(id).then(cat => { //encontrando categoria no banco pra poder enviar pro front
        if (cat != undefined) {
            res.render('admin/categories/edit', { catg: cat })
        } else {
            res.redirect('/admin/categories')
        }
    }).catch(err => {
        res.redirect('/admin/categories')
    })
})

//rota pra atualizar categoria
router.post('/categories/update', adminAuth, (req, res) => {
    console.log(req.body)
    let id = req.body.id
    let title = req.body.title


    //atualizando titulo por id
    Category.update({ title: title, slug: slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

export default router;