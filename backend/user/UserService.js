/** import UserModel */
const User = require('./UserModel')

//https://stackoverflow.com/questions/75635190/mongooseerror-model-find-no-longer-accepts-a-callback
async function getUsers() {
    try{ 
        const users = await User.find();
        console.log("Alles Super")
        return users;
    }catch(err){
        console.log("Fehler bei Suche: " + err)
        throw err;
    }             
}

//find User by ID
async function findUserByID(searchUserID){
    console.log("UserService: find user by ID:" + searchUserID);
    if(!searchUserID){
        throw new Error("UserID is missing");   
    }
    try{
        var query = await User.findOne({ userID: searchUserID});
            if(!query){
                    if('admin' == searchUserID){
                        console.log('Do not have admin account yet. Create it with default password')
                        var adminUser = new User({
                            userID: "admin",
                            firstName: "Default Administrator Account",
                            password: "123",
                            isAdministrator: true
                        });
                        await adminUser.save();
                        return adminUser; 
                    }else{ 
                        console.log('Could not find user for user ID: '+ searchUserID);
                        return null;
                    }
            }
                console.log(`Found userID:`+ searchUserID);
                return query;
    }catch(err){
        console.error('Error finding user:', err);
        throw err;
    }
}

//Create a new User
async function createUser(newData) {
    try{ 
        const users = await User.create(newData);
        console.log("Alles Super bei Insert user")
        return users;
    }catch(err){
        console.log("Fehler bei Insert user : " + err)
        throw err;
    }              
}

//Update a User
async function updateUser(userID, updateUserData) {
    try{ 
        //https://stackoverflow.com/questions/43401790/using-findone-and-findoneandupdate-with-http-request-mongoose
        //https://stackoverflow.com/questions/74491704/objectparametererror-parameter-filter-to-findone-must-be-an-object-got
        //https://stackoverflow.com/questions/54144293/update-user-information
        
        const user = await User.findOne({ userID });
         // Check if the password is being updated
        if(updateUserData.password){
            // Update user instance with new data
           user.set(updateUserData);
           const updatedUser = await user.save();
           const updatedUserOne = await User.findOneAndUpdate({userID}, updatedUser,{new: true});
           return updatedUserOne;
        }
        const updatedUserOne = await User.findOneAndUpdate({userID}, updateUserData,{new: true});
        console.log("Alles Super beim Update user")
        return updatedUserOne;
    }catch(err){
        console.log("Fehler bei Update user : " + err)
        throw err;
    }            
}
//delete  a user
async function deleteUser(userID) {
    try{ 
         //https://mongoosejs.com/docs/6.x/docs/api/model.html#model_Model-deleteOne
        const users = await User.deleteOne({userID});
        console.log("Alles Super beim Loeschen")
        return users;
    }catch(err){
        console.log("Fehler bei Delete user : " + err)
        throw err;
    }            
}

module.exports = {
    getUsers,
    findUserByID,
    createUser,
    updateUser,
    deleteUser
    
}