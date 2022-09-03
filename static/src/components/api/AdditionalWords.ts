import ErrorUser from "../utils/ErrorUser";

const localLink = "http://localhost:7474";
const BASELINK = "https://rs-lang-machine.herokuapp.com";
// interface ICreateUser {
//   name: string;
//   email: string;
//   password: string;
// }

// interface ILoginUser {
//   email: string;
//   password: string;
// }

// interface IAuth {
//   message: string;
//   token: string;
//   refreshToken: string;
//   userId: string;
//   name: string;
// }

class AdditionalWords {
  static createWord = async () => {
    // const rawResponse = await fetch(`${localLink}/users`, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(user),
    // });
    // try {
    //   return rawResponse;
    // } catch (e) {
    //   return new ErrorUser(rawResponse);
    // }
  };
}

export { AdditionalWords };
