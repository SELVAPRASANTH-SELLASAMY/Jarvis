const { connect, disConnect } = require("./db");
const exceptionBound = async(statement,res) => {
    try{
        await connect('nomad');
        await statement();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Something went wrong",error:error});
    }
    finally{
        try{
            await disConnect();
        }
        catch(error){
            console.warn(`Error while disconnecting from the database ${error}`);
        }
    }
}
module.exports = exceptionBound;