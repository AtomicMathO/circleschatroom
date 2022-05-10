const formMain = document.querySelector(".join-main");
const loginForm = document.getElementById("login");
const joinForm = document.getElementById("join-form");
const roomsChoice = document.getElementById("room");

let fetchUser = {
  email: "",
  password: "",
};

let user = {
  id: 0,
  surname: "",
  token: "",
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchUser.email = e.target.email.value;
  fetchUser.password = e.target.password.value;
  logUser(fetchUser.email, fetchUser.password);
});

const logUser = function (email, password) {
  axios({
    method: "post",
    url: "https://cercles.herokuapp.com/api/login",
    data: {
      email: email,
      password: password,
    },
  }).then(
    (response) => {
      user.id = response.data.user_id;
      user.surname = response.data.surname;
      user.token = response.data.token;
      getUserCircles(user.id);

      formMain.removeChild(loginForm);
      const userInput = document.createElement("input");
      userInput.type = "text";
      userInput.name = "surname";
      userInput.id = "user_id";
      userInput.value = user.surname;
      userInput.textContent = user.surname;
      joinForm.prepend(userInput);
    },
    (error) => {
      console.log(error);
    }
  );
};

const getUserCircles = function (userId) {
  const url = `https://cercles.herokuapp.com/api/profil/${userId}/circles`;
  const token = user.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  axios.get(url, config).then((response) => {
    const circles = response.data[0].circles;

    for (const circle of circles) {
      const option = document.createElement("option");
      option.value = `${circle.unique_code}, ${circle.name}`;
      option.textContent = circle.name;
      roomsChoice.append(option);
    }
  }),
    (error) => {
      console.log(error);
    };
};
