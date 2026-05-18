

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const loginbtn =
  document.getElementById("loginbtn");

const message =
  document.getElementById("message");


// CREATE STORAGE IF EMPTY

if(!localStorage.getItem("users")) {

  localStorage.setItem(
    "users",
    JSON.stringify([])
  );
}


// REGISTER + LOGIN

loginbtn.addEventListener(
  "click",
  () => {

    const username =
      usernameInput.value.trim();

    const password =
      passwordInput.value.trim();


    if(!username || !password) {

      message.textContent =
        "Enter all fields";

      return;
    }


    const users = JSON.parse(
      localStorage.getItem("users")
    );


    // CHECK IF USER EXISTS

    const existingUser = users.find(
      user =>
        user.username === username
    );


    // LOGIN

    if(existingUser) {

      if(existingUser.password === password) {

        message.textContent =
          "Login Successful";

        localStorage.setItem(
          "currentUser",
          JSON.stringify(existingUser)
        );

      } else {

        message.textContent =
          "Wrong Password";
      }

      return;
    }


    // REGISTER NEW USER

    const newUser = {

      username,
      password
    };


    users.push(newUser);


    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );


    localStorage.setItem(
      "currentUser",
      JSON.stringify(newUser)
    );


    message.textContent =
      "Account Created";
});
