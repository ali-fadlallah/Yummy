/* ======================================================== SideBar ======================================================== */

new WOW().init();

let sideBarMenuWight = $(".sideBarMenu").outerWidth(true);
let searchByName = document.getElementById("searchByName");
let searchByFirstChar = document.getElementById("searchByFirstChar");

$("#sideBar").animate({ left: `-${sideBarMenuWight}` }, 0);

$(".sideBarMenuIcon").click(function (e) {
    closeSlider();
});

$(".nav-link").click(function (e) {
    closeSlider();

    if (this.innerHTML == "Search") {
        $("#loadingScreen").fadeIn(1000, function () {
            $(document).ready(function () {
                $("#mealHome").css("display", "block");
                $("#mealDetails").addClass("d-none");
                $("#searchInputs").removeClass("d-none");
                $("#homeMealRow").addClass("d-none");

                searchByName.value = "";
                searchByFirstChar.value = "";

                $("#loadingScreen").fadeOut(1000, function () {
                    $("body").css("overflow", "visible");
                });
            });
        });
    } else if (this.innerHTML == "Categories") {
        fetchCategory();
    } else if (this.innerHTML == "Area") {
        fetchArea();
    } else if (this.innerHTML == "Ingredients") {
        fetchIngredients();
    } else if (this.innerHTML == "Contact Us") {
        showContactUs();
    }
});

function closeSlider() {
    $(".sideBarMenuIcon i").toggleClass("fa-xmark");

    if ($("#sideBar").css("left") == "0px") {
        $("#sideBar").animate({ left: `-${sideBarMenuWight}` }, 500);
        $(".itemSearch").animate({ opacity: "0", marginTop: "30px" }, 1000);
        $(".itemCate").animate({ opacity: "0", marginTop: "30px" }, 1000);
        $(".itemArea").animate({ opacity: "0", marginTop: "30px" }, 1000);
        $(".itemIng").animate({ opacity: "0", marginTop: "30px" }, 1000);
        $(".itemCont").animate({ opacity: "0", marginTop: "30px" }, 1000);
    } else {
        $("#sideBar").animate({ left: `0px` }, 500, function () {
            $(".itemSearch").animate({ opacity: "1", marginTop: "0px" }, 1000);
            $(".itemCate").animate({ opacity: "1", marginTop: "0px" }, 1100);
            $(".itemArea").animate({ opacity: "1", marginTop: "0px" }, 1200);
            $(".itemIng").animate({ opacity: "1", marginTop: "0px" }, 1300);
            $(".itemCont").animate({ opacity: "1", marginTop: "0px" }, 1400);
        });
    }
}

/* ==================================================== Variable Deceleration ==================================================== */

let mealRow = document.getElementById("homeMealRow");
const regexName = /^[a-zA-Z1-9ا-ي أ]{3,100}$/;
const regexAge = /^[2-7][0-9]|80$/;
const regexMobile = /^(010|011|012|015)[1-9]{8}$/;
const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

let txtName,
    txtEmail,
    txtMobile,
    txtAge,
    txtPassword,
    txtRePassword,
    alertName,
    alertEmail,
    alertNumber,
    alertPassword,
    alertRePassword,
    alertAge,
    btnSubmit;

/* ======================================================== Home ======================================================== */

$("#loadingScreen").fadeIn(1000, function () {
    $(document).ready(function () {
        $("#loadingScreen").fadeOut(1000, function () {
            fetchMeals("s", "");

            $("body").css("overflow", "visible");
        });
    });
});

async function fetchMeals(paramter, nameOfMeal) {
    let myRequest = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?${paramter}=${nameOfMeal}`
    );

    let myResponse = await myRequest.json();

    if (myResponse.meals == null) {
        alert("Invalid");
    } else {
        displayTheMeals(myResponse.meals);
    }
}

function displayTheMeals(allMeals) {
    let temp = "";
    allMeals.forEach((element) => {
        temp += `
            <div class=" col-md-3 wow wobble"  data-wow-duration="2s" data-wow-delay="0.5s" >
            <div onclick="getMealID('${element.idMeal}')" class="itemMeal" >
              <img src="${element.strMealThumb}" class="w-100 rounded" alt="">
              <div class="innerBox d-flex justify-content-center align-items-center rounded">
                <h4 class="text-center">${element.strMeal}</h4>
              </div>
            </div>
          </div>
          `;
    });

    mealRow.innerHTML = temp;
    mealRow.classList.add("justify-content-center");
}

function getMealID(mealID) {
    $("body").css("overflow", "hidden");

    $("#mealHome").fadeOut(500, function () {
        $("#loadingScreen").fadeIn(1000, function () {
            $(document).ready(function () {
                $("#mealDetails")
                    .removeClass("d-none")
                    .fadeIn(500, function () {
                        getMealDetails(mealID);

                        $("#loadingScreen").fadeOut(1000, function () {
                            $("body").css("overflow", "visible");
                        });
                    });
            });
        });
    });
}

/* ======================================================== Meal Details ======================================================== */

async function getMealDetails(mealID) {
    let myRequest = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );

    let myResponse = await myRequest.json();
    displayMealsDetails(myResponse.meals);
}

function displayMealsDetails(response) {
    $("#strMealThumb").attr("src", response[0].strMealThumb);
    $("#strMeal").html(response[0].strMeal);
    $("#strInstructions").html(response[0].strInstructions);
    $("#strArea").html(response[0].strArea);
    $("#strCategory").html(response[0].strCategory);

    let tempRecipes = "";
    let tempTags = "";
    for (let i = 1; i <= 20; i++) {
        if (response[0][`strIngredient${i}`]) {
            tempRecipes += `<span class="badge fw-normal text-bg-success m-2 p-2">${response[0][`strMeasure${i}`]
                } ${response[0][`strIngredient${i}`]}</span>`;
        }
    }

    if (response[0].strTags == null) {
        $("#tagsTitle").remove();
    } else {
        let splitTags = response[0].strTags.split(",");

        for (let i = 0; i < splitTags.length; i++) {
            tempTags += `<span class="badge fw-normal text-bg-danger m-2 p-2">${splitTags[i]}</span>`;
        }
    }

    document.getElementById("Recipes").innerHTML = tempRecipes;
    document.getElementById("Tags").innerHTML = tempTags;

    // "strYoutube": "https://www.youtube.com/watch?v=gfhfsBPt46s",
    // "strSource": "https://www.bbcgoodfood.com/recipes/classic-lasagne",

    if (response[0].strSource != null) {
        $("#btnSource").click(function () {
            window.open(`${response[0].strSource}`, "_blank");
        });
    } else {
        $("#btnSource").hide();
    }

    if (response[0].strYoutube != null) {
        $("#btnYoutube").click(function () {
            window.open(`${response[0].strYoutube}`, "_blank");
        });
    } else {
        $("#btnYoutube").hide();
    }
}

/* ======================================================== Search ======================================================== */

$("#searchByName").keyup(function () {
    $("#loadingScreen").fadeIn(1000, function () {
        $(document).ready(function () {
            let searchByName = $("#searchByName").val();

            $("#homeMealRow").removeClass("d-none");

            fetchMeals("s", searchByName);

            $("#loadingScreen").fadeOut(1000, function () {
                $("body").css("overflow", "visible");
            });
        });
    });
});

$("#searchByFirstChar").keyup(function () {
    $("#loadingScreen").fadeIn(1000, function () {
        $(document).ready(function () {
            let searchByName = $("#searchByFirstChar").val();

            $("#homeMealRow").removeClass("d-none");

            fetchMeals("f", searchByName);

            $("#loadingScreen").fadeOut(1000, function () {
                $("body").css("overflow", "visible");
            });
        });
    });
});

/* ======================================================== Category ======================================================== */

async function fetchCategory() {
    let myRequest = await fetch(
        `https://www.themealdb.com/api/json/v1/1/categories.php`
    );

    let myResponse = await myRequest.json();

    $("#loadingScreen").fadeIn(1000, function () {
        $(document).ready(function () {
            $("#homeMealRow").removeClass("d-none");
            $("#mealDetails").addClass("d-none");
            $("#searchInputs").addClass("d-none");
            $("#mealHome").css("display", "block");

            displayTheCategories(myResponse.categories);

            $("#loadingScreen").fadeOut(1000, function () {
                $("body").css("overflow", "visible");
            });
        });
    });
}

function displayTheCategories(allMeals) {
    let temp = "";
    allMeals.forEach((element) => {

        temp += `
            <div class=" col-md-3 wow bounceInDown" data-wow-duration="2s" data-wow-delay="0.5s" >
            <div onclick="filterByCategory('${"c"}','${element.strCategory
            }')" class="itemMeal" >
              <img src="${element.strCategoryThumb
            }" class=" w-100 rounded" alt="Category Thumb">
              <div class="innerBox d-flex justify-content-center align-items-center flex-column rounded">
                <h4 class="py-1">${element.strCategory}</h4>
                <p>${element.strCategoryDescription
                .split(" ")
                .splice(0, 5)
                .join(" ")}
                <a class="">Read More</a>
                </p>
              </div>
            </div>
          </div>
          `;
    });

    mealRow.innerHTML = temp;

    mealRow.classList.add("justify-content-center");

}

async function filterByCategory(paramter, Category) {
    let myRequest = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?${paramter}=${Category}`
    );

    let myResponse = await myRequest.json();

    $("body").css("overflow", "hidden");

    $("#loadingScreen").fadeIn(1000, function () {
        $(document).ready(function () {
            displayTheMeals(myResponse.meals);

            $("#loadingScreen").fadeOut(1000, function () {
                $("body").css("overflow", "visible");
            });
        });
    });
}

/* ======================================================== Area ======================================================== */

async function fetchArea() {
    let myRequest = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );

    let myResponse = await myRequest.json();

    $("#loadingScreen").fadeIn(1000, function () {
        $(document).ready(function () {
            $("#homeMealRow").removeClass("d-none");
            $("#mealDetails").addClass("d-none");
            $("#searchInputs").addClass("d-none");
            $("#mealHome").css("display", "block");
            displayTheArea(myResponse.meals);

            $("#loadingScreen").fadeOut(1000, function () {
                $("body").css("overflow", "visible");
            });
        });
    });
}

function displayTheArea(Areas) {
    let temp = "";
    Areas.forEach((element) => {
        temp += `
            <div class=" col-md-3 wow rollIn" data-wow-duration="2s" data-wow-delay="0.5s" >
            <div onclick="filterByCategory('${"a"}','${element.strArea
            }')" class="itemMeal text-center" >
              <img src="images/flag.jpeg" class="m-auto w-50 rounded" alt="Country Flag">
              <h5 class="text-center text-info mt-1">${element.strArea}</h5>
            </div>
          </div>
          `;
    });

    mealRow.innerHTML = temp;

    mealRow.classList.add("justify-content-center");
}

/* ======================================================== Ingredients ======================================================== */

async function fetchIngredients() {
    let myRequest = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );

    let myResponse = await myRequest.json();

    $("#loadingScreen").fadeIn(1000, function () {
        $(document).ready(function () {
            $("#homeMealRow").removeClass("d-none");
            $("#mealDetails").addClass("d-none");
            $("#searchInputs").addClass("d-none");
            $("#mealHome").css("display", "block");

            displayIngredients(myResponse.meals);

            $("#loadingScreen").fadeOut(1000, function () {
                $("body").css("overflow", "visible");
            });
        });
    });
}

function displayIngredients(allMeals) {
    let temp = "";

    for (let i = 0; i <= 19; i++) {
        temp += `
        <div class=" col-md-3 wow flipInX" data-wow-duration="2s" data-wow-delay="0.5s" >
        <div onclick="filterByCategory('${"i"}','${allMeals[i].strIngredient
            }')" class="itemMeal text-center text-white" >
        <img src="images/dish.jpeg" class="m-auto w-100 rounded" alt="Dishs Image">
        <div class="p-2">
        
        <h4>${allMeals[i].strIngredient}</h4>
        <p>${allMeals[i].strDescription.split(" ").splice(0, 20).join(" ")}
        <a class="">Read More</a>
        </p>
        </div>
        </div>
      </div>
      `;
    }

    mealRow.innerHTML = temp;

    mealRow.classList.add("justify-content-center");
}

/* ======================================================== Contacts Us ======================================================== */

function showContactUs() {
    $("#loadingScreen").fadeIn(1000, function () {
        $(document).ready(function () {
            // $("#mealDetails").addClass("d-none");
            // $("#searchInputs").addClass("d-none");

            $("#mealHome").css("display", "block");
            $("#homeMealRow").removeClass("d-none");
            $("#mealDetails").addClass("d-none");
            $("#searchInputs").addClass("d-none");

            displayContactUs();

            txtName.value = "";
            txtEmail.value = "";
            txtMobile.value = "";
            txtAge.value = "";
            txtPassword.value = "";
            txtRePassword.value = "";

            $("#loadingScreen").fadeOut(1000, function () {
                $("body").css("overflow", "visible");
            });
        });
    });
}

function displayContactUs() {
    let temp = `
    <h3 class=" text-white ms-auto text-center">Contact Us</h3>
    <div class="col-md-6">
         <div class="mb-3">
            <input id="txtName" onkeyup=checkAllInputs() type="text" class="form-control text-center" placeholder="Enter your name">
            <div id="alertName" class="text-center mt-1 py-2 alert alert-danger d-none">Invalid name >> hint: the minimum from 3 characters to 100 characters</div>
         </div>
  </div>

    <div class="col-md-6">
        <div class="mb-3">
             <input id="txtEmail" onkeyup=checkAllInputs() type="email" class="form-control text-center" placeholder="Enter your email address">
             <div id="alertEmail" class="text-center mt-1 py-2 alert alert-danger d-none">Invalid email address</div>
         </div>
    </div>

    <div class="col-md-6">
    <div class="mb-3">
       <input id="txtMobile" onkeyup=checkAllInputs() type="number" class="form-control text-center" placeholder="Enter your mobile number">
       <div id="alertNumber" class="text-center mt-1 py-2 alert alert-danger d-none">Invalid Mobile Number >> hint: it's must be a egyption number</div>

    </div>
</div>

<div class="col-md-6">
   <div class="mb-3">
        <input id="txtAge" type="number" onkeyup=checkAllInputs() class="form-control text-center" placeholder="Enter your age">
        <div id="alertAge" class=" text-center mt-1 py-2 alert alert-danger d-none">Invalid Age >> hint: the age from 20 - 80</div>

    </div>
</div>


<div class="col-md-6">
<div class="mb-3">
   <input id="txtPassword"  type="password" onkeyup=checkAllInputs() class="form-control text-center" placeholder="Enter your password">
   <div id="alertPassword" class="text-center mt-1 py-2 alert alert-danger d-none">Hint >> the minimum eight characters, at least one letter and one number</div>

</div>
</div>

<div class="col-md-6">
<div class="mb-3">
    <input id="txtRePassword" type="password" onkeyup=checkAllInputs() class="form-control text-center" placeholder="Confirm your password">
    <div id="alertRePassword" class="text-center mt-1 py-2 alert alert-danger d-none">the password confirmation does not match</div>

</div>
</div>

    <button id="btnSubmit" disabled type="button" class="btn btn-outline-danger w-25">Submit</button>

  `;

    mealRow.innerHTML = temp;

    mealRow.classList.add("justify-content-center");

    txtName = document.getElementById("txtName");
    txtEmail = document.getElementById("txtEmail");
    txtMobile = document.getElementById("txtMobile");
    txtAge = document.getElementById("txtAge");
    txtPassword = document.getElementById("txtPassword");
    txtRePassword = document.getElementById("txtRePassword");

    alertPassword = document.getElementById("alertPassword");
    alertRePassword = document.getElementById("alertRePassword");
    alertAge = document.getElementById("alertAge");
    alertEmail = document.getElementById("alertEmail");
    alertNumber = document.getElementById("alertNumber");
    alertName = document.getElementById("alertName");

    btnSubmit = document.getElementById("btnSubmit");
}

function checkAllInputs() {
    if (
        theName() &&
        theEmail() &&
        theMobile() &&
        theAge() &&
        thePassword() &&
        theRePassword()
    ) {
        btnSubmit.disabled = false;
    } else {
        btnSubmit.disabled = true;
    }
}

function theName() {
    if (regexName.test(txtName.value) == true) {
        alertName.classList.replace("d-block", "d-none");
        txtName.classList.remove("is-invalid");
        txtName.classList.add("is-valid");

        return true;
    } else {
        alertName.classList.replace("d-none", "d-block");
        txtName.classList.add("is-invalid");
        txtName.classList.remove("is-valid");

        return false;
    }
}

function theEmail() {
    if (regexEmail.test(txtEmail.value) == true) {
        alertEmail.classList.replace("d-block", "d-none");
        txtEmail.classList.remove("is-invalid");
        txtEmail.classList.add("is-valid");

        return true;
    } else {
        alertEmail.classList.replace("d-none", "d-block");
        txtEmail.classList.add("is-invalid");
        txtEmail.classList.remove("is-valid");

        return false;
    }
}

function theMobile() {
    if (regexMobile.test(txtMobile.value) == true) {
        alertNumber.classList.replace("d-block", "d-none");
        txtMobile.classList.remove("is-invalid");
        txtMobile.classList.add("is-valid");

        return true;
    } else {
        alertNumber.classList.replace("d-none", "d-block");
        txtMobile.classList.add("is-invalid");
        txtMobile.classList.remove("is-valid");

        return false;
    }
}

function theAge() {
    if (regexAge.test(txtAge.value) == true) {
        alertAge.classList.replace("d-block", "d-none");
        txtAge.classList.remove("is-invalid");
        txtAge.classList.add("is-valid");

        return true;
    } else {
        alertAge.classList.replace("d-none", "d-block");
        txtAge.classList.add("is-invalid");
        txtAge.classList.remove("is-valid");

        return false;
    }
}

function thePassword() {
    if (regexPassword.test(txtPassword.value) == true) {
        alertPassword.classList.replace("d-block", "d-none");
        txtPassword.classList.remove("is-invalid");
        txtPassword.classList.add("is-valid");

        return true;
    } else {
        alertPassword.classList.replace("d-none", "d-block");
        txtPassword.classList.add("is-invalid");
        txtPassword.classList.remove("is-valid");

        return false;
    }
}

function theRePassword() {
    if (txtPassword.value == txtRePassword.value) {
        alertRePassword.classList.replace("d-block", "d-none");
        txtRePassword.classList.remove("is-invalid");
        txtRePassword.classList.add("is-valid");

        return true;
    } else {
        alertRePassword.classList.replace("d-none", "d-block");
        txtRePassword.classList.add("is-invalid");
        txtRePassword.classList.remove("is-valid");

        return false;
    }
}

/* ======================================================== the End Of JS ======================================================== */
