import bridge from '@vkontakte/vk-bridge';

class User{

    constructor(user, sign){
        this.id = user.id;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.photo = user.photo_200;
        this.sign = sign;
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

    getSign(){return this.sign}

}

export default User;