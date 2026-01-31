import jwt from 'jsonwebtoken'

const protect = async(req , res , next) =>{
    let token = req.headers.authorization;
    
    if(!token){
        return res.status(401).json({message : 'No token provided, authorization denied'});
    }
    
    // Handle Bearer token format
    if(token.startsWith('Bearer ')){
        token = token.slice(7, token.length).trimStart();
    }
    
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.userId = decoded.userId;
        next();
    } catch (error){
        console.error('Token verification failed:', error.message);
        return res.status(401).json({message : 'Token is not valid or has expired'})
    }
}

export default protect;