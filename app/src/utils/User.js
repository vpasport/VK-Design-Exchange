import bridge from '@vkontakte/vk-bridge';

class User{

    constructor(user){
        this.id = user.id;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.photo = user.photo_200;
    }

    getId(){
        return this.id;
    }

    getFirstName(){
        return this.firstName;
    }

    getLastName(){
        return this.lastName;
    }

    getPhoto(){
        return this.photo;
    }

}

export default User;