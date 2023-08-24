const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login');
    };

    static async loginPost(req, res) {
        
        const {email, password} = req.body;

        // find user by email
        const user = await User.findOne({ where:{email: email} });

        if(!user) {
            req.flash('message', 'Usuario não encontrado!');
            res.redirect('/login');

            return;
        };

        // check password match
        const passwordMatch = bcrypt.compareSync(password, user.password);

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!');
            res.redirect('/login');

            return;
        };

       // initialize session 
       req.session.userid = user.id;
       req.session.user = user;

       req.flash('message', `Bem Vindo ${user.name}!`);

       req.session.save(() => {
           res.redirect('/',);
       });
    };

    static register(req, res) {
        res.render('auth/register');
    };

    static async registerPost(req, res) {
        const {name, email, password, confirmpassword} = req.body;

        // passowrd match validation
        if(password != confirmpassword){
            req.flash('message', 'As senhas não conferem, tente novamente!');
            res.render('auth/register');

            return;
        };

        // check if user exists
        const checkIfUserExists = await User.findOne({where: {email: email}});

        if(checkIfUserExists) {
            req.flash('message', 'O e-mail já está cadastrado, tente novamente!');
            res.render('auth/register');

            return;
        };

        // create a password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassowrd = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassowrd
        };

        try {
            const createduser = await User.create(user); // Necessario encapsular o usuario em uma variavel para poder acessar posteriomente o ID!

            // initialize session 
            req.session.userid = createduser.id;
            req.session.user = createduser;

            req.flash('message', 'Cadastro realizado com sucesso!');

            req.session.save(() => {
                res.redirect('/');
            });

        } catch (error) {
            console.log(error);
        };
    };

    static logout(req, res) {
        req.session.destroy();
        res.redirect('/login');
    };


}