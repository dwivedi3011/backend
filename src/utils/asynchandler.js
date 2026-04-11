const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    };
};

export default asyncHandler;
// this is created beacuse of the easier to handle 
// const asyncHandler =(fn) => async(req,res,next)=>{
//     try {
//         await(req,res,next){

//         }
//     } catch (error) {
//         res.status(err.code|| 500).json({
//             success: false,
//             message: err.message
//         })
//     }
//}