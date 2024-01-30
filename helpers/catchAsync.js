//fn cela va être une fonction comme une fonction de rappel que l'on va passer en paramètre
//Cette fonction va retourner une fonction qui prend trois pramètres req,res,next
//Next nous permet grâce à Express de passer au middleware de traitement suivant.
const catchAsync = (fn) => {
    return (req, res, next)=>{
        Promise
        .resolve(fn(req,res,next))
        .catch((err)=>next(err));
    };
};

module.exports = catchAsync;