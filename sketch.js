let signInButton, logoutButton, commentInput, saveCommentButton;
let slider;
let slider2;
let slider3;
let userName = "";
let customFont;
var lwhs = 0; // 0 is non lwhs, 1 is lwhs
let firstCharacter = "";
var fc = 0; // 0 is teacher, 1 is student
let signedIn = 0; //0 has not tried
let classDropdown, teacherDropdown;
let classFavoriteAdd = "";
let classFaviriteRemove;
let classes = {
  "Select Class": [""],
  Science: ["Teacher4", "Teacher5", "Teacher6"],
  History: ["Teacher7", "Teacher8", "Teacher9"],
  Physics: ["Teacher4", "Teacher1"],
};
var welcomeMSGx = 1070;
var welcomeMSGy = 15;
let classFavorites = [];
let classFavoritesArray = {};
let reviews = 0; //0 is no review
let viewreviews = 0; //0 is not viewing reviews
let viewClassSelect = "";
let viewAVGClass = "";
let teacherAVGClass = {};
let classSelectionMade = false;
let happyImage, midImage, sadImage, greatImage, madImage;
let comments = []; // Array to store comments fetched from Firebase
let textComments = [];
let AnonymousCheckBox;
let isChecked = true;
let shownName = "";
var SIBx = 40;
var SIBy = 40;
var LOBx = 1000;
var LOBy = 55;
var CIBx = 420;
var CIBy = 512;
var SCBx = 535;
var SCBy = 600;
let FCB0 = "";
let FCB1 = "";
let FCB2 = "";
let FCB3 = "";
let FCB4 = "";
let FCB5 = "";
let FCB6 = "";
let FCB7 = "";
let favSelectionMade = false;
let favSelection = "";

function preload() {
  // Load the font file
  customFont = loadFont("Poppins-Regular.ttf");
  happyImage = loadImage("Happy.png");
  midImage = loadImage("mid.png");
  sadImage = loadImage("Sad.png");
  greatImage = loadImage("Great.png");
  madImage = loadImage("Mad.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
  calculateAverageClassReviews();
  calculateAverageTeacherReviews();
  welcomeMSGx = windowWidth - 130;
  welcomeMSGy = 15;
  LOBx = windowWidth - 200;
  LOBy = 55;

  // Initialize the "Sign in with Google" button
  signInButton = createButton("Sign In with Google");
  signInButton.position(SIBx, SIBy);
  signInButton.size(200, 40);
  signInButton.mousePressed(signInWithGoogle);

  // Initialize the logout button but hide it initially
  logoutButton = createButton("Logout");
  logoutButton.position(LOBx, LOBy); // Upper right corner
  logoutButton.style("font-size", "20px");
  logoutButton.mousePressed(signOut);
  logoutButton.size(80, 40);
  logoutButton.hide();

  // Input for comments
  commentInput = createInput();
  commentInput.position(windowWidth / 2 - 187.5, CIBy);
  commentInput.style("text-align", "center");
  commentInput.size(375, 30);
  commentInput.hide();

  // Button to save the comment
  saveCommentButton = createButton("Save Comment");
  saveCommentButton.position(windowWidth / 2 - 75, SCBy);
  saveCommentButton.mousePressed(saveComment);
  saveCommentButton.size(150, 50);
  saveCommentButton.style("font-size", "16px");
  saveCommentButton.style("text-align", "center");
  saveCommentButton.hide();

  slider = createSlider(1, 10, 1); // Create slider with range from 1 to 10, starting at 1
  slider.position(windowWidth / 2 - 180, 450);
  slider.style("width", "360px");
  slider.hide();

  slider2 = createSlider(1, 10, 1); // Create slider with range from 1 to 10, starting at 1
  slider2.position(windowWidth / 2 - 180, 350);
  slider2.style("width", "360px");
  slider2.hide();

  slider3 = createSlider(1, 10, 1); // Create slider with range from 1 to 10, starting at 1
  slider3.position(windowWidth / 2 - 180, 250);
  slider3.style("width", "360px");
  slider3.hide();

  classDropdown = createSelect();
  classDropdown.style("font-size", "16px");
  classDropdown.style("text-align", "center");
  classDropdown.position(windowWidth / 2 - 100, 110);
  classDropdown.size(200, 40);
  for (let cls in classes) {
    classDropdown.option(cls);
  }
  classDropdown.changed(updateTeacherDropdown);
  classDropdown.hide();

  // Create teacher dropdown
  teacherDropdown = createSelect();
  teacherDropdown.style("font-size", "16px");
  teacherDropdown.style("text-align", "center");
  teacherDropdown.position(windowWidth / 2 - 100, 170);
  teacherDropdown.size(200, 40);
  teacherDropdown.hide();

  reviewbutton = createButton("Review A Class");
  reviewbutton.style("font-size", "25px");
  reviewbutton.style("text-align", "center");
  reviewbutton.style("background-color", "#67AEFF");
  reviewbutton.position(windowWidth / 2 + 100, 170);
  reviewbutton.size(300, 600);
  reviewbutton.mousePressed(toggleVariable1);
  reviewbutton.hide();

  viewreviewbutton = createButton("View Class Reviews");
  viewreviewbutton.style("font-size", "25px");
  viewreviewbutton.style("text-align", "center");
  viewreviewbutton.style("background-color", "#67AEFF");
  viewreviewbutton.position(windowWidth / 2 - 300, 170);
  viewreviewbutton.size(300, 600);
  viewreviewbutton.mousePressed(toggleVariable2);
  viewreviewbutton.hide();

  homepagebutton = createButton("Home");
  homepagebutton.style("font-size", "15px");
  homepagebutton.style("text-align", "center");
  homepagebutton.style("background-color", "#67AEFF");
  homepagebutton.position(50, 55);
  homepagebutton.size(80, 40);
  homepagebutton.mousePressed(toggleVariable3);
  homepagebutton.hide();

  viewclassDropdown = createSelect();
  viewclassDropdown.style("font-size", "16px");
  viewclassDropdown.style("text-align", "center");
  viewclassDropdown.position(windowWidth / 2 - 100, 140);
  viewclassDropdown.size(200, 40);
  for (let cls in classes) {
    viewclassDropdown.option(cls);
  }
  viewclassDropdown.changed(classSelectionChanged);
  viewclassDropdown.hide();

  saveFavoriteButton = createButton("Add to Favorites");
  saveFavoriteButton.style("font-size", "15px");
  saveFavoriteButton.style("text-align", "center");
  saveFavoriteButton.position(windowWidth / 2 - 100, 700);
  saveFavoriteButton.size(200, 40);
  saveFavoriteButton.mousePressed(toggleVariable4);
  saveFavoriteButton.hide();

  AnonymousCheckBox = createCheckbox("Anonymous", true);
  AnonymousCheckBox.position(windowWidth / 2 - 50, 570);
  AnonymousCheckBox.hide();
  let joe = 50;
  favoriteClassButton0 = createButton(FCB0);
  favoriteClassButton0.style("font-size", "20px");
  favoriteClassButton0.style("text-align", "center");
  favoriteClassButton0.size(300, joe);
  favoriteClassButton0.mousePressed(toggleVariable5);
  favoriteClassButton0.hide();

  favoriteClassButton1 = createButton(FCB1);
  favoriteClassButton1.style("font-size", "20px");
  favoriteClassButton1.style("text-align", "center");
  favoriteClassButton1.size(300, joe);
  favoriteClassButton1.mousePressed(toggleVariable5);
  favoriteClassButton1.hide();

  favoriteClassButton2 = createButton(FCB2);
  favoriteClassButton2.style("font-size", "20px");
  favoriteClassButton2.style("text-align", "center");
  favoriteClassButton2.size(300, joe);
  favoriteClassButton2.mousePressed(toggleVariable5(2));
  favoriteClassButton2.hide();

  favoriteClassButton3 = createButton(FCB3);
  favoriteClassButton3.style("font-size", "20px");
  favoriteClassButton3.style("text-align", "center");
  favoriteClassButton3.size(300, joe);
  favoriteClassButton3.mousePressed(toggleVariable5(3));
  favoriteClassButton3.hide();

  favoriteClassButton4 = createButton(FCB4);
  favoriteClassButton4.style("font-size", "20px");
  favoriteClassButton4.style("text-align", "center");
  favoriteClassButton4.size(300, joe);
  favoriteClassButton4.mousePressed(toggleVariable5(4));
  favoriteClassButton4.hide();

  favoriteClassButton5 = createButton(FCB5);
  favoriteClassButton5.style("font-size", "20px");
  favoriteClassButton5.style("text-align", "center");
  favoriteClassButton5.size(300, joe);
  favoriteClassButton5.mousePressed(toggleVariable5(5));
  favoriteClassButton5.hide();

  favoriteClassButton6 = createButton(FCB6);
  favoriteClassButton6.style("font-size", "20px");
  favoriteClassButton6.style("text-align", "center");
  favoriteClassButton6.size(300, joe);
  favoriteClassButton6.mousePressed(toggleVariable5(6));
  favoriteClassButton6.hide();

  favoriteClassButton7 = createButton(FCB7);
  favoriteClassButton7.style("font-size", "20px");
  favoriteClassButton7.style("text-align", "center");
  favoriteClassButton7.size(300, joe);
  favoriteClassButton7.mousePressed(toggleVariable5(7));
  favoriteClassButton7.hide();

  // Adjust UI elements if the window is resized
  windowResized();

  // Authentication state observer
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var userEmail = user.email;
      let firstCharacter = userEmail.charAt(0);
      // Check if the email ends with "lwhs.org"
      if (userEmail.endsWith("lwhs.org")) {
        if (!isNaN(parseInt(firstCharacter))) {
          if (reviews == 1) {
            //write review page
            logoutButton.show();
            signInButton.hide();
            commentInput.show();
            saveCommentButton.show();
            slider.show();
            slider2.show();
            slider3.show();
            teacherDropdown.show();
            classDropdown.show();
            reviewbutton.hide();
            viewreviewbutton.hide();
            homepagebutton.show();
            saveFavoriteButton.hide();
            AnonymousCheckBox.show();
            favoriteClassButton0.hide();
            favoriteClassButton1.hide();
            favoriteClassButton2.hide();
            favoriteClassButton3.hide();
            favoriteClassButton4.hide();
            favoriteClassButton5.hide();
            favoriteClassButton6.hide();
            favoriteClassButton7.hide();
            userName = user.displayName || "User";
            print("bob");
            lwhs = 1;
            fc = 1;
          } else if (viewreviews == 1) {
            //view review page
            reviewbutton.hide();
            viewreviewbutton.hide();
            signInButton.hide();
            logoutButton.show();
            commentInput.hide();
            saveCommentButton.hide();
            slider.hide();
            slider2.hide();
            slider3.hide();
            teacherDropdown.hide();
            classDropdown.hide();
            homepagebutton.show();
            viewclassDropdown.show();
            saveFavoriteButton.show();
            AnonymousCheckBox.hide();
            favoriteClassButton0.show();
            favoriteClassButton1.show();
            favoriteClassButton2.show();
            favoriteClassButton3.show();
            favoriteClassButton4.show();
            favoriteClassButton5.show();
            favoriteClassButton6.show();
            favoriteClassButton7.show();
            userName = user.displayName || "User";
            print("omar");
            lwhs = 1;
            fc = 1;
          } else {
            //menu
            reviewbutton.show();
            viewreviewbutton.show();
            signInButton.hide();
            logoutButton.show();
            commentInput.hide();
            saveCommentButton.hide();
            slider.hide();
            slider2.hide();
            slider3.hide();
            teacherDropdown.hide();
            classDropdown.hide();
            homepagebutton.hide();
            viewclassDropdown.hide();
            saveFavoriteButton.hide();
            AnonymousCheckBox.hide();
            favoriteClassButton0.hide();
            favoriteClassButton1.hide();
            favoriteClassButton2.hide();
            favoriteClassButton3.hide();
            favoriteClassButton4.hide();
            favoriteClassButton5.hide();
            favoriteClassButton6.hide();
            favoriteClassButton7.hide();
            userName = user.displayName || "User";
            lwhs = 1;
            fc = 1;
            print("joe");
          }
        } else {
          //teacher view
          signInButton.hide();
          logoutButton.show();
          commentInput.hide();
          saveCommentButton.hide();
          slider.hide();
          slider2.hide();
          slider3.hide();
          teacherDropdown.hide();
          classDropdown.hide();
          saveFavoriteButton.hide();
          AnonymousCheckBox.hide();
          favoriteClassButton0.hide();
          favoriteClassButton1.hide();
          favoriteClassButton2.hide();
          favoriteClassButton3.hide();
          favoriteClassButton4.hide();
          favoriteClassButton5.hide();
          favoriteClassButton6.hide();
          favoriteClassButton7.hide();
          userName = user.displayName || "User";
          lwhs = 1;
          fc = 0;
        }
      } else {
        console.log("User email does not end with 'lwhs.org'");
        lwhs = 0;
        signedIn = 1;
      }
    } else {
      signInButton.show();
      logoutButton.hide();
      commentInput.hide();
      saveCommentButton.hide();
      slider.hide();
      slider2.hide();
      slider3.hide();
      saveFavoriteButton.hide();
      reviewbutton.hide();
      viewreviewbutton.hide();
      signInButton.show();
      commentInput.hide();
      saveCommentButton.hide();
      slider.hide();
      slider2.hide();
      slider3.hide();
      teacherDropdown.hide();
      classDropdown.hide();
      homepagebutton.hide();
      viewclassDropdown.hide();
      saveFavoriteButton.hide();
      AnonymousCheckBox.hide();
      favoriteClassButton0.hide();
      favoriteClassButton1.hide();
      favoriteClassButton2.hide();
      favoriteClassButton3.hide();
      favoriteClassButton4.hide();
      favoriteClassButton5.hide();
      favoriteClassButton6.hide();
      favoriteClassButton7.hide();
      userName = "";
      print("joe");
    }
  });
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);
  background("#6F6F6F");

  // Show welcome message near logout button if user is signed in
  if (userName) {
    if (fc == 1) {
      //student
      if (reviews == 1) {
        //write a review
        logoutButton.show();
        signInButton.hide();
        commentInput.show();
        saveCommentButton.show();
        slider.show();
        slider2.show();
        slider3.show();
        teacherDropdown.show();
        classDropdown.show();
        reviewbutton.hide();
        viewreviewbutton.hide();
        homepagebutton.show();
        saveFavoriteButton.hide();
        AnonymousCheckBox.show();
        favoriteClassButton0.hide();
        favoriteClassButton1.hide();
        favoriteClassButton2.hide();
        favoriteClassButton3.hide();
        favoriteClassButton4.hide();
        favoriteClassButton5.hide();
        favoriteClassButton6.hide();
        favoriteClassButton7.hide();
        fill(0);
        textSize(15);
        textFont(customFont);
        text("Review:", windowWidth / 2 - 240, 510);
        textSize(20); // Smaller text size
        textAlign(RIGHT, TOP);
        text(`Welcome ${userName}`, welcomeMSGx, welcomeMSGy);
        textSize(12);
        textAlign(CENTER, CENTER);
        for (let i = 1; i <= 10; i++) {
          let xPos = map(i, 1, 10, 30, width - 10);
          text(i, xPos / (windowWidth / 355) + windowWidth / 2 - 185, 430);
        }
        for (let i = 1; i <= 10; i++) {
          let xPos = map(i, 1, 10, 30, width - 10);
          text(i, xPos / (windowWidth / 355) + windowWidth / 2 - 185, 330);
        }
        for (let i = 1; i <= 10; i++) {
          let xPos = map(i, 1, 10, 30, width - 10);
          text(i, xPos / (windowWidth / 355) + windowWidth / 2 - 185, 230);
        }
        if (slider.value() <= 1) {
          image(madImage, windowWidth / 2 + 50, 465, 25, 25);
        } else if (slider.value() <= 3) {
          image(sadImage, windowWidth / 2 + 50, 465, 25, 25);
        } else if (slider.value() <= 6) {
          image(midImage, windowWidth / 2 + 50, 465, 25, 25);
        } else if (slider.value() <= 9) {
          image(happyImage, windowWidth / 2 + 50, 465, 25, 25);
        } else {
          image(greatImage, windowWidth / 2 + 50, 465, 25, 25);
        }
        if (slider2.value() <= 1) {
          image(greatImage, windowWidth / 2 + 50, 365, 25, 25);
        } else if (slider2.value() <= 3) {
          image(happyImage, windowWidth / 2 + 50, 365, 25, 25);
        } else if (slider2.value() <= 6) {
          image(midImage, windowWidth / 2 + 50, 365, 25, 25);
        } else if (slider2.value() <= 9) {
          image(sadImage, windowWidth / 2 + 50, 365, 25, 25);
        } else {
          image(madImage, windowWidth / 2 + 50, 365, 25, 25);
        }
        if (slider3.value() <= 1) {
          image(madImage, windowWidth / 2 + 50, 265, 25, 25);
        } else if (slider3.value() <= 3) {
          image(sadImage, windowWidth / 2 + 50, 265, 25, 25);
        } else if (slider3.value() <= 6) {
          image(midImage, windowWidth / 2 + 50, 265, 25, 25);
        } else if (slider3.value() <= 9) {
          image(happyImage, windowWidth / 2 + 50, 265, 25, 25);
        } else {
          image(greatImage, windowWidth / 2 + 50, 265, 25, 25);
        }
        textSize(15);
        text("Teacher Review:", windowWidth / 2 - 258, 450);
        text("Workload:", windowWidth / 2 - 240, 350);
        text("Class Review:", windowWidth / 2 - 250, 250);
        // Display selected value
        textAlign(CENTER, CENTER);
        textSize(15);
        text("Selected: " + slider.value(), width / 2 - 10, 475);
        text("Selected: " + slider2.value(), width / 2 - 10, 375);
        text("Selected: " + slider3.value(), width / 2 - 10, 275);
        //print(reviews);
        isChecked = AnonymousCheckBox.checked();
        if (isChecked == true) {
          shownName = "";
        } else {
          shownName = userName;
        }
      } else if (viewreviews == 1) {
        //view reviews
        reviewbutton.hide();
        viewreviewbutton.hide();
        signInButton.hide();
        logoutButton.show();
        commentInput.hide();
        saveCommentButton.hide();
        slider.hide();
        slider2.hide();
        slider3.hide();
        teacherDropdown.hide();
        classDropdown.hide();
        homepagebutton.show();
        viewclassDropdown.show();
        saveFavoriteButton.show();
        AnonymousCheckBox.hide();
        viewclassDropdown.changed(classSelectionChanged);
        ClassFavList()
          .then((classFav) => {
            classFavorites = classFav;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        let bobob = classFavorites.length;
        let bobobob = 50;
        console.log(classFavorites);
        //bobob = classFavorites.length;
        yPos = 180;
        if (bobob >= 1) {
          favoriteClassButton0.html(classFavorites[0]);
          favoriteClassButton0.position(8, yPos);
          favoriteClassButton0.show();
          yPos += bobobob;
        }
        if (bobob >= 2) {
          favoriteClassButton1.html(classFavorites[1]);
          favoriteClassButton1.position(8, yPos);
          favoriteClassButton1.show();
          yPos += bobobob;
        }
        if (bobob >= 3) {
          favoriteClassButton2.html(classFavorites[2]);
          favoriteClassButton2.position(8, yPos);
          favoriteClassButton2.show();
          yPos += bobobob;
        }
        if (bobob >= 4) {
          favoriteClassButton3.html(classFavorites[3]);
          favoriteClassButton3.position(8, yPos);
          favoriteClassButton3.show();
          yPos += bobobob;
        }
        if (bobob >= 5) {
          favoriteClassButton4.html(classFavorites[4]);
          favoriteClassButton4.position(8, yPos);
          favoriteClassButton4.show();
          yPos += bobobob;
        }
        if (bobob >= 6) {
          favoriteClassButton5.html(classFavorites[5]);
          favoriteClassButton5.position(8, yPos);
          favoriteClassButton5.show();
          yPos += bobobob;
        }
        if (bobob >= 7) {
          favoriteClassButton6.html(classFavorites[6]);
          favoriteClassButton6.position(8, yPos);
          favoriteClassButton6.show();
          yPos += bobobob;
        }
        if (bobob >= 8) {
          favoriteClassButton7.html(classFavorites[7]);
          favoriteClassButton7.position(8, yPos);
          favoriteClassButton7.show();
          yPos += bobobob;
        }
        if (favSelectionMade == true) {
          if (viewclassDropdown.value() == "Select Class") {
            selectedClass = classFavorites[favSelection];
            classSelectionMade = true;
          } else {
            selectedClass = viewclassDropdown.value();
          }
        } else {
          selectedClass = viewclassDropdown.value();
        }
        console.log(selectedClass);
        if (classSelectionMade == true) {
          // Display the text
          if (viewClassSelect == "Select Class") {
          } else {
            textSize(20);
            textAlign(CENTER, CENTER);
            const rating = Number(viewAVGClass).toFixed(2);
            text(
              viewClassSelect + "'s Average Review: " + rating + "/10",
              windowWidth / 2,
              230
            );
            const textCommentsRef = textComments;
            console.log(textCommentsRef);
            let yPos = 170;
            for (let i = 0; i < textCommentsRef.length; i++) {
              const review = textCommentsRef[i];
              let yourName = "";
              if (review.name == userName) {
                yourName = " (you)";
                //console.log(yourName);
              }
              let plural = "";
              let timeType = "";
              const difference_seconds = timeDifference(review.time);
              //console.log(timeDifference(review.time));
              if (difference_seconds >= 60) {
                convertedTime = Math.floor(difference_seconds / 60);
                timeType = "minute";
                if (convertedTime >= 60) {
                  timeType = "hour";
                  convertedTime = Math.floor(convertedTime / 60);
                  if (convertedTime >= 24) {
                    timeType = "day";
                    convertedTime = Math.floor(convertedTime / 24);
                    if (convertedTime >= 7) {
                      convertedTime = Math.floor(convertedTime / 7);
                      timeType = "week";
                      if (convertedTime >= 30) {
                        timeType = "month";
                        convertedTime = Math.floor(convertedTime / 30.4375);
                      }
                    }
                  }
                }
              } else {
                timeType = "second";
              }
              if (convertedTime >= 2) {
                plural = "s";
              }
              const textToShow = review.review;
              // Split the text into lines with 30 characters each
              const lines = splitTextIntoLines(textToShow);
              textSize(18);
              text(
                review.class + " (" + review.teacher + "):",
                windowWidth - 175,
                yPos
              );
              yPos += 25;
              // Display each line of text
              for (let j = 0; j < lines.length; j++) {
                const line = lines[j];
                textAlign(CENTER, CENTER);
                textSize(17);
                text(line, windowWidth - 175, yPos); // Display the line of text at the calculated y position

                yPos += 20; // Move to the next line
              }

              textSize(15);
              if (review.name) {
                if (review.name == "") {
                } else {
                  yPos += 5;
                  text("- " + review.name + yourName, windowWidth - 175, yPos);
                  yPos += 20;
                }
              }

              textSize(10);
              text(
                convertedTime + " " + timeType + plural + " ago",
                windowWidth - 175,
                yPos
              );
              yPos += 20;
            }
            yPos = 320; // Starting y-position for teacher reviews
            for (const teacherName in teacherAVGClass) {
              const teacherReview = Number(
                teacherAVGClass[teacherName]
              ).toFixed(2);
              textAlign(CENTER, CENTER);
              textSize(18);
              text(
                teacherName + "'s Average Review: " + teacherReview + "/10",
                windowWidth / 2,
                yPos
              );
              yPos += 50; // Increase y-position for the next teacher's review
            }
          }
        } else {
          // If class selection hasn't been made or the asynchronous operation hasn't completed yet, display a message indicating that
          textSize(40);
          textAlign(CENTER, CENTER);
          text("Please make a class selection", windowWidth / 2, 300);
        }

        fill(0);
        textFont(customFont);
        textSize(20); // Smaller text size
        textAlign(RIGHT, TOP);
        text(`Welcome ${userName}`, welcomeMSGx, welcomeMSGy);
        line(0, 100, 10000, 100);
        line(windowWidth - 350, 100, windowWidth - 350, 10000);
        line(300, 100, 300, 10000);
        text("Reviews", windowWidth - 135, 120);
        text("Your Favorites (Under Construction)", 220, 120);
      } else {
        //menu
        reviewbutton.show();
        viewreviewbutton.show();
        signInButton.hide();
        logoutButton.show();
        commentInput.hide();
        saveCommentButton.hide();
        slider.hide();
        slider2.hide();
        slider3.hide();
        teacherDropdown.hide();
        classDropdown.hide();
        homepagebutton.hide();
        viewclassDropdown.hide();
        saveFavoriteButton.hide();
        AnonymousCheckBox.hide();
        favoriteClassButton0.hide();
        favoriteClassButton1.hide();
        favoriteClassButton2.hide();
        favoriteClassButton3.hide();
        favoriteClassButton4.hide();
        favoriteClassButton5.hide();
        favoriteClassButton6.hide();
        favoriteClassButton7.hide();
        classSelectionChanged();
        textSize(25);
        textAlign(CENTER, CENTER);
        text(
          "Please Choose What You Would Like To Do",
          windowWidth / 2 + 20,
          100
        );
        fill(0);
        textFont(customFont);
        textSize(20); // Smaller text size
        textAlign(RIGHT, TOP);
        text(`Welcome ${userName}`, welcomeMSGx, welcomeMSGy);
      }
    } else {
      fill(0);
      textFont(customFont);
      textSize(20); // Smaller text size
      textAlign(RIGHT, TOP);
      text(`Welcome ${userName}`, welcomeMSGx, welcomeMSGy);
    }
  }
  if (lwhs == 0) {
    //nonlwhs
    textFont(customFont);
    textAlign(CENTER, CENTER);
    textSize(40);
    text(
      "Please Log In With Your School Email",
      windowWidth / 2,
      windowHeight / 2 - 150
    );
    if (signedIn == 1) {
      textSize(20);
      text("Wrong Email", windowWidth / 2, 200);
    }
  }
}
function updateTeacherDropdown() {
  let selectedClass = classDropdown.value();
  let teachers = classes[selectedClass];
  teacherDropdown.remove();
  teacherDropdown = createSelect();
  teacherDropdown.style("font-size", "16px");
  teacherDropdown.style("text-align", "center");
  teacherDropdown.position(windowWidth / 2 - 100, 170);
  teacherDropdown.size(200, 40);
  for (let i = 0; i < teachers.length; i++) {
    teacherDropdown.option(teachers[i]);
  }
}
function signInWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .catch((error) => {
      console.error("Error during sign-in:", error.message);
    });
}

function signOut() {
  lwhs = 0;
  signedIn = 0;
  firebase
    .auth()
    .signOut()
    .catch((error) => {
      console.error("Sign out error:", error.message);
    });
}
function classSelectionChanged() {
  const selectedClass = viewclassDropdown.value();
  viewClassSelect = selectedClass;
  classSelectionMade = true;
  favSelectionMade = false;
  toggleVariable4();
  calculateAverageClassReviews()
    .then((averageClassReviews) => {
      const selectedClass = viewclassDropdown.value();
      const averageRating = averageClassReviews[selectedClass];
      console.log("Average rating for selected class:", averageRating);
      // You can use averageRating to create text or perform any other operation
      viewAVGClass = averageRating; // Assign averageRating to viewAVGClass
      viewClassSelect = selectedClass;
      print("bob");
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  calculateAverageTeacherReviews(selectedClass)
    .then((averageTeacherReviews) => {
      const selectedClass = viewclassDropdown.value();
      teacherAVGClass = averageTeacherReviews; // Assign average teacher reviews to teacherAVGClass
      viewClassSelect = selectedClass;
    })
    .catch((error) => {
      console.error("Error calculating average teacher reviews:", error);
    });
  textReviews(selectedClass)
    .then((textReviews) => {
      const selectedClass = viewclassDropdown.value();
      textComments = textReviews; // Assign average teacher reviews to teacherAVGClass
      viewClassSelect = selectedClass;
    })
    .catch((error) => {
      console.error("Error Finding Reviews:", error);
    });
}
function saveComment() {
  const comment = commentInput.value();
  const classr = slider3.value();
  const workr = slider2.value();
  const teacherr = slider.value();
  const classm = classDropdown.value();
  const teacherm = teacherDropdown.value();
  const shownUserName = shownName;
  const AddToFavorites = classFavoriteAdd;
  const userId = firebase.auth().currentUser.uid;
  // Save the comment to Firebase; adjust the path as necessary for your data structure
  firebase
    .database()
    .ref("comments/" + userId)
    .push({
      username: userName,
      name: shownUserName,
      comment: comment,
      classr: classr,
      workr: workr,
      teacherr: teacherr,
      classm: classm,
      teacherm: teacherm,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      AddToFav: AddToFavorites,
    })
    .then(() => {
      console.log("Comment saved successfully.");
      commentInput.value(""); // Clear the input after saving
      slider.value(1);
      slider2.value(1);
      slider3.value(1);
    })
    .catch((error) => {
      console.error("Error saving comment:", error.message);
    });
  console.log(comments);
}
function saveFavorites() {
  const AddToFavorites = classFavoriteAdd;
  const userId = firebase.auth().currentUser.uid;
  // Save the comment to Firebase; adjust the path as necessary for your data structure
  firebase
    .database()
    .ref("comments/" + userId)
    .push({
      username: userName,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      AddToFav: AddToFavorites,
    })
    .then(() => {
      console.log("Comment saved successfully.");
      commentInput.value(""); // Clear the input after saving
    })
    .catch((error) => {
      console.error("Error saving comment:", error.message);
    });
}

function windowResized() {
  if (userName) {
    location.reload();
  }
}

function toggleVariable1() {
  reviews = 1;
}
function toggleVariable2() {
  viewreviews = 1;
}
function toggleVariable3() {
  viewreviews = 0;
  reviews = 0;
}
function toggleVariable4() {
  const classSelected = viewclassDropdown.value();
  console.log(classSelected);
  if (classSelected) {
    if (classSelected == "Select Class") {
    } else {
      if (!classFavoriteAdd.includes(classSelected)) {
        classFavoriteAdd = classSelected;
        saveFavorites();
        console.log("Selected classes:", classFavoriteAdd);
      }
    }
  }
}
function toggleVariable5() {
  favSelectionMade = true;
  favSelection = 0;
  viewclassDropdown.value("Select Class");
}

function calculateAverageClassReviews() {
  return new Promise((resolve, reject) => {
    const classRatings = {};
    const classCommentsRef = firebase.database().ref("comments");

    classCommentsRef
      .once("value", (snapshot) => {
        snapshot.forEach((userSnapshot) => {
          userSnapshot.forEach((commentSnapshot) => {
            const classReview = commentSnapshot.child("classr").val();
            const className = commentSnapshot.child("classm").val();

            if (!classRatings[className]) {
              classRatings[className] = { sum: 0, count: 0 };
            }

            classRatings[className].sum += classReview;
            classRatings[className].count++;
          });
        });

        const averageClassReviews = {};
        for (const className in classRatings) {
          const { sum, count } = classRatings[className];
          averageClassReviews[className] = sum / count;
        }

        console.log("Average class reviews:", averageClassReviews);
        resolve(averageClassReviews);
      })
      .catch((error) => {
        console.error("Error calculating average class reviews:", error);
        reject(error);
      });
  });
}

function calculateAverageTeacherReviews(selectedClass) {
  return new Promise((resolve, reject) => {
    const teacherRatings = {};
    const teacherCommentsRef = firebase.database().ref("comments");

    teacherCommentsRef
      .once("value", (snapshot) => {
        snapshot.forEach((userSnapshot) => {
          userSnapshot.forEach((commentSnapshot) => {
            const teacherReview = commentSnapshot.child("teacherr").val();
            const teacherName = commentSnapshot.child("teacherm").val();
            const className = commentSnapshot.child("classm").val();

            // Check if the comment belongs to the selected class
            if (className === selectedClass) {
              if (!teacherRatings[teacherName]) {
                teacherRatings[teacherName] = { sum: 0, count: 0 };
              }

              teacherRatings[teacherName].sum += teacherReview;
              teacherRatings[teacherName].count++;
            }
          });
        });

        const averageTeacherReviews = {};
        for (const teacherName in teacherRatings) {
          const { sum, count } = teacherRatings[teacherName];
          averageTeacherReviews[teacherName] = sum / count;
        }

        console.log(
          "Average teacher reviews for",
          selectedClass + ":",
          averageTeacherReviews
        );
        resolve(averageTeacherReviews);
      })
      .catch((error) => {
        console.error("Error calculating average teacher reviews:", error);
        reject(error);
      });
  });
}
function textReviews(selectedClass) {
  return new Promise((resolve, reject) => {
    const textReviews = [];
    const textReviewsRef = firebase.database().ref("comments");

    textReviewsRef
      .once("value", (snapshot) => {
        snapshot.forEach((userSnapshot) => {
          userSnapshot.forEach((commentSnapshot) => {
            const reviewUserName = commentSnapshot.child("name").val();
            const textReview = commentSnapshot.child("comment").val();
            const teacherName = commentSnapshot.child("teacherm").val();
            const className = commentSnapshot.child("classm").val();
            const timestamp = commentSnapshot.child("timestamp").val();

            // Check if the comment belongs to the selected class
            if (className === selectedClass) {
              if (textReview == "") {
              } else {
                textReviews.push({
                  class: className,
                  teacher: teacherName,
                  review: textReview,
                  time: timestamp,
                  name: reviewUserName,
                });
              }
            }
          });
        });
        console.log("Reviews for", selectedClass + ":", textReviews);
        // Resolve the promise with the list of teacher reviews
        resolve(textReviews);
      })
      .catch((error) => {
        console.error("Error finding reviews:", error);
        reject(error);
      });
  });
}
// function favTextReviews() {
//   return new Promise((resolve, reject) => {
//     const favTextReviews = [];
//     const favTextReviewsRef = firebase.database().ref("comments");

//     favTextReviewsRef
//       .once("value", (snapshot) => {
//         snapshot.forEach((userSnapshot) => {
//           userSnapshot.forEach((commentSnapshot) => {
//             const reviewUserName = commentSnapshot.child("name").val();
//             const textReview = commentSnapshot.child("comment").val();
//             const teacherName = commentSnapshot.child("teacherm").val();
//             const classReview = commentSnapshot.child("classr").val();
//             const className = commentSnapshot.child("classm").val();
//             const timestamp = commentSnapshot.child("timestamp").val();

//             // Check if the comment belongs to the selected class
//             if (ClassFav.includes(classFavorites)) {
//               if (textReview == "") {
//               } else {
//                 favTextReviews.push({
//                   class: className,
//                   teacher: teacherName,
//                   review: textReview,
//                   time: timestamp,
//                   name: reviewUserName,
//                   classrev: classReview,
//                 });
//               }
//             }
//           });
//         });
//         // Resolve the promise with the list of teacher reviews
//         resolve(favTextReviews);
//       })
//       .catch((error) => {
//         console.error("Error finding reviews:", error);
//         reject(error);
//       });
//   });
// }
function ClassFavList() {
  return new Promise((resolve, reject) => {
    const classFav = [];
    const ClassFavRef = firebase.database().ref("comments");

    ClassFavRef.once("value", (snapshot) => {
      snapshot.forEach((userSnapshot) => {
        userSnapshot.forEach((commentSnapshot) => {
          const UserName = commentSnapshot.child("username").val();
          const FavList = commentSnapshot.child("AddToFav").val();
          // Check if the comment belongs to the selected class
          if (userName == UserName) {
            if (FavList) {
              if (FavList == "") {
              } else {
                if (!classFav.includes(FavList)) {
                  classFav.push(FavList);
                }
              }
            }
          }
        });
      });
      // Resolve the promise
      resolve(classFav);
    }).catch((error) => {
      console.error("Error finding reviews:", error);
      reject(error);
    });
  });
}
function splitTextIntoLines(text) {
  const lines = [];
  let line = "";
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (line.length + words[i].length <= 40) {
      line += words[i] + " ";
    } else {
      lines.push(line);
      line = words[i] + " ";
    }
  }
  if (line !== "") {
    lines.push(line);
  }
  return lines;
}
function timeDifference(unix_time) {
  let current_time = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
  let difference_seconds = current_time - Math.floor(unix_time / 1000);
  return difference_seconds;
}
