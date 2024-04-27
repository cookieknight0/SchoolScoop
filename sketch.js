let signInButton, logoutButton, commentInput, saveCommentButton;
let slider;
let slider2;
let slider3;
let userName = "";
let customFont;
var lwhs = 0; // 0 is non lwhs, 1 is lwhs
let firstCharacter = "";
var fc = 0; // 0 is teacher, 1 is student
let classDropdown, teacherDropdown;
let classes = {
    "Select Class": [""],
  "Science": ["Teacher4", "Teacher5", "Teacher6"],
  "History": ["Teacher7", "Teacher8", "Teacher9"],
  "Physics": ["Teacher4","Teacher1"]
};
let reviews = 0; //0 is no review
let viewreviews = 0; //0 is not viewing reviews


let happyImage, midImage, sadImage, greatImage, madImage;
let comments = []; // Array to store comments fetched from Firebase
var SIBx = 40;
var SIBy = 40;
var LOBx = 1000;
var LOBy = 75;
var CIBx = 420;
var CIBy = 512;
var SCBx = 535;
var SCBy = 600;


function preload() {
    // Load the font file
    customFont = loadFont('Poppins-Regular.ttf');
    happyImage = loadImage('Happy.png');
    midImage = loadImage('mid.png');
    sadImage = loadImage('Sad.png');
    greatImage = loadImage('Great.png');
    madImage = loadImage('Mad.png');
  }
  


function setup() {
    createCanvas(windowWidth, windowHeight);
    calculateAverageClassReviews();
    calculateAverageTeacherReviews();
    // Initialize the "Sign in with Google" button
    signInButton = createButton('Sign In with Google');
    signInButton.position(SIBx, SIBy);
    signInButton.size(200,40)
    signInButton.mousePressed(signInWithGoogle);

    // Initialize the logout button but hide it initially
    logoutButton = createButton('Logout');
    logoutButton.position(LOBx, LOBy); // Upper right corner
    logoutButton.style('font-size', '20px');
    logoutButton.mousePressed(signOut);
    logoutButton.size(100,30);
    logoutButton.hide();

    // Input for comments
    commentInput = createInput();
    commentInput.position(CIBx,CIBy);
    commentInput.size(375,30);
    commentInput.hide();

    // Button to save the comment
    saveCommentButton = createButton('Save Comment');
    saveCommentButton.position(SCBx, SCBy);
    saveCommentButton.mousePressed(saveComment);
    saveCommentButton.size(150,50);
    saveCommentButton.style("font-size", "16px");
    saveCommentButton.style("text-align", "center");
    saveCommentButton.hide();

    slider = createSlider(1, 10, 1); // Create slider with range from 1 to 10, starting at 1
    slider.position(420, 200);
    slider.style('width', '360px');
    slider.hide();

    slider2 = createSlider(1, 10, 1); // Create slider with range from 1 to 10, starting at 1
    slider2.position(420, 350);
    slider2.style('width', '360px');
    slider2.hide();

    slider3 = createSlider(1, 10, 1); // Create slider with range from 1 to 10, starting at 1
    slider3.position(420, 250);
    slider3.style('width', '360px');
    slider3.hide();

    classDropdown = createSelect();
    classDropdown.style("font-size", "16px");
    classDropdown.style("text-align", "center");
    classDropdown.position(500, 110);
    classDropdown.size(200,40);
    for (let cls in classes) {
        classDropdown.option(cls);
    }
    classDropdown.changed(updateTeacherDropdown);
    classDropdown.hide();

    // Create teacher dropdown
    teacherDropdown = createSelect();
    teacherDropdown.style("font-size", "16px");
    teacherDropdown.style("text-align", "center");
    teacherDropdown.position(500, 170);
    teacherDropdown.size(200,40);
    teacherDropdown.hide();

    reviewbutton = createButton('Review A Class');
    reviewbutton.style("font-size", "25px");
    reviewbutton.style("text-align", "center");
    reviewbutton.style('background-color', '#67AEFF');
    reviewbutton.position(windowWidth/2 +100, 170);
    reviewbutton.size(300,600);
    reviewbutton.mousePressed(toggleVariable1);
    reviewbutton.hide();

    viewreviewbutton = createButton('View Class Reviews');
    viewreviewbutton.style("font-size", "25px");
    viewreviewbutton.style("text-align", "center");
    viewreviewbutton.style('background-color', '#67AEFF');
    viewreviewbutton.position(windowWidth/2 - 300, 170);
    viewreviewbutton.size(300,600);
    viewreviewbutton.mousePressed(toggleVariable2);
    viewreviewbutton.hide();

    homepagebutton = createButton('Home');
    homepagebutton.style("font-size", "15px");
    homepagebutton.style("text-align", "center");
    homepagebutton.style('background-color', '#67AEFF');
    homepagebutton.position( 50, 50);
    homepagebutton.size(80,40);
    homepagebutton.mousePressed(toggleVariable3);
    homepagebutton.hide();

    viewclassDropdown = createSelect();
    viewclassDropdown.style("font-size", "16px");
    viewclassDropdown.style("text-align", "center");
    viewclassDropdown.position(500, 110);
    viewclassDropdown.size(200,40);
    for (let cls in classes) {
        viewclassDropdown.option(cls);
    }
    viewclassDropdown.hide();
    
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
                    if (reviews == 1){ //write review page
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
                        userName = user.displayName || "User";
                        print("bob");
                        lwhs = 1;
                        fc = 1;
                    } else if (viewreviews == 1){ //view review page
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
                        userName = user.displayName || "User";
                        print("omar");
                        lwhs = 1;
                        fc = 1;
                    } else{ //menu
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
                        userName = user.displayName || "User";
                        lwhs = 1;
                        fc = 1;
                        print('joe')
                    }
                    
                  } else { //teacher view
                    signInButton.hide();
                    logoutButton.show();
                    commentInput.hide();
                    saveCommentButton.hide();
                    slider.hide();
                    slider2.hide();
                    slider3.hide();
                    teacherDropdown.hide();
                    classDropdown.hide();
                    userName = user.displayName || "User";
                    lwhs = 1;
                    fc = 0;
                  }
                
                
            } else {
                console.log("User email does not end with 'lwhs.org'");
                lwhs = 0;

            }
            
        } else {
            signInButton.show();
            logoutButton.hide();
            commentInput.hide();
            saveCommentButton.hide();
            slider.hide();
            slider2.hide();
            slider3.hide();
            userName = "";
            print("joe");
        }
    });

    
}

function draw() {
    background('#6F6F6F');
    // Show welcome message near logout button if user is signed in
    if (userName) {
        if (fc == 1){
            if (reviews == 1){
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
                fill(0);
                textSize(15);
                textFont(customFont);
                text('Review:',(windowWidth/2)-240, 510)
                textSize(20); // Smaller text size
                textAlign(RIGHT, TOP);
                text(`Welcome ${userName}`, windowWidth - 130, 15);
                textSize(12);
                textAlign(CENTER, CENTER);
                for (let i = 1; i <= 10; i++) {
                    let xPos = map(i, 1, 10, 30, width - 10);
                    text(i, xPos/3.3+410, 430);
                }
                for (let i = 1; i <= 10; i++) {
                    let xPos = map(i, 1, 10, 30, width - 10);
                    text(i, xPos/3.3+410, 330);
                }
                for (let i = 1; i <= 10; i++) {
                    let xPos = map(i, 1, 10, 30, width - 10);
                    text(i, xPos/3.3+410, 230);
                }
                if (slider.value() <= 1) {
                    image(madImage, windowWidth/2+50, 465,25,25);
                } else if (slider.value() <= 3) {
                    image(sadImage, windowWidth/2+50, 465,25,25);
                } else if (slider.value() <= 6) {
                    image(midImage, windowWidth/2+50, 465,25,25);
                } else if (slider.value() <= 9) {
                    image(happyImage, windowWidth/2+50, 465,25,25);
                } else {
                    image(greatImage, windowWidth/2+50, 465,25,25);
                }
                if (slider2.value() <= 1) {
                    image(greatImage, windowWidth/2+50, 365,25,25);
                } else if (slider2.value() <= 3) {
                    image(happyImage, windowWidth/2+50, 365,25,25);
                } else if (slider2.value() <= 6) {
                    image(midImage, windowWidth/2+50, 365,25,25);
                } else if (slider2.value() <= 9) {
                    image(sadImage, windowWidth/2+50, 365,25,25);
                } else {
                    image(madImage, windowWidth/2+50, 365,25,25);
                }
                if (slider3.value() <= 1) {
                    image(madImage, windowWidth/2+50, 265,25,25);
                } else if (slider3.value() <= 3) {
                    image(sadImage, windowWidth/2+50, 265,25,25);
                } else if (slider3.value() <= 6) {
                    image(midImage, windowWidth/2+50, 265,25,25);
                } else if (slider3.value() <= 9) {
                    image(happyImage, windowWidth/2+50, 265,25,25);
                } else {
                    image(greatImage, windowWidth/2+50, 265,25,25);
                }
                textSize(15);
                text("Teacher Review:", (windowWidth/2)-258, 450);
                text("Workload:", (windowWidth/2)-240, 350);
                text("Class Review:", (windowWidth/2)-250, 250);
                // Display selected value
                textAlign(CENTER, CENTER);
                textSize(15);
                text("Selected: " + slider.value(), width/2 - 10, 475);
                text("Selected: " + slider2.value(), width/2 - 10, 375);
                text("Selected: " + slider3.value(), width/2 - 10, 275);
                //fetchTimestamps();
                //calculateAverageClassReviews();
                //calculateAverageTeacherReviews();
                print(reviews);
            } else if (viewreviews == 1){
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
                selectedClass = viewclassDropdown.value();

                // Display average class reviews for the selected class
                textSize(16);
                textAlign(LEFT, TOP);
                let yOffset = 50; // Initial Y offset for the first review
                if (selectedClass && calculateAverageClassReviews[selectedClass]) {
                    const averageRating = calculateAverageClassReviews[selectedClass];
                    let reviewText = `Class: ${selectedClass}, Average Rating: ${averageRating}`;
                    text(reviewText, 50, yOffset);
                    yOffset += 20; // Increase Y offset for the next review
                }

                // Display average teacher reviews
                textSize(16);
                textAlign(LEFT, TOP);
                yOffset = 50; // Reset Y offset for teacher reviews
                for (const teacherName in calculateAverageTeacherReviews) {
                    const averageRating = calculateAverageTeacherReviews[teacherName];
                    let reviewText = `Teacher: ${teacherName}, Average Rating: ${averageRating}`;
                    text(reviewText, 400, yOffset);
                    yOffset += 20; // Increase Y offset for the next review
                }
            }else{
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
                textSize(25)
                text('Please Choose What You Would Like To Do',windowWidth/2 + 20,100);
            }
            
        } else {
            fill(0);
            textFont(customFont);
            textSize(20); // Smaller text size
            textAlign(RIGHT, TOP);
            text(`Welcome ${userName}`, windowWidth - 130, 15);
        }
    }
    if (lwhs == 0) {
        textSize(40);
        textFont(customFont);
        textAlign(CENTER, CENTER);
        text("Please Log In With Your School Email",windowWidth/2,windowHeight/2 - 150)
    }

}
function updateTeacherDropdown() {
    let selectedClass = classDropdown.value();
    let teachers = classes[selectedClass];
    teacherDropdown.remove();
    teacherDropdown = createSelect();
    teacherDropdown.style("font-size", "16px");
    teacherDropdown.style("text-align", "center");
    teacherDropdown.position(500, 170);
    teacherDropdown.size(200,40);
    for (let i = 0; i < teachers.length; i++) {
      teacherDropdown.option(teachers[i]);
    }
}
function signInWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).catch((error) => {
        console.error("Error during sign-in:", error.message);
    });
}

function signOut() {
    firebase.auth().signOut().catch((error) => {
        console.error("Sign out error:", error.message);
    });
}

function saveComment() {
    const comment = commentInput.value();
    const classr = slider3.value();
    const workr = slider2.value();
    const teacherr = slider.value();
    const classm = classDropdown.value();
    const teacherm = teacherDropdown.value();
    const userId = firebase.auth().currentUser.uid;
    // Save the comment to Firebase; adjust the path as necessary for your data structure
    firebase.database().ref('comments/' + userId).push({
        username: userName,
        comment: comment,
        classr: classr,
        workr: workr,
        teacherr: teacherr,
        classm: classm,
        teacherm: teacherm,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        console.log("Comment saved successfully.");
        commentInput.value(''); // Clear the input after saving
        slider.value(1);
        slider2.value(1);
        slider3.value(1);
    }).catch((error) => {
        console.error("Error saving comment:", error.message);
    });
    console.log(comments)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    logoutButton.position(LOBx,LOBy);
    commentInput.position(CIBx, CIBy);
    saveCommentButton.position(SCBx, SCBy);
    slider.position(420,450);
    
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


function calculateAverageClassReviews() {
    const classRatings = {};
    const classCommentsRef = firebase.database().ref('comments');

    classCommentsRef.once('value', (snapshot) => {
        snapshot.forEach((userSnapshot) => {
            userSnapshot.forEach((commentSnapshot) => {
                const classReview = commentSnapshot.child('classr').val();
                const className = commentSnapshot.child('classm').val();
                
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

        console.log('Average class reviews:', averageClassReviews);
    }).catch((error) => {
        console.error('Error calculating average class reviews:', error);
    });
}

function calculateAverageTeacherReviews() {
    const teacherRatings = {};
    const teacherCommentsRef = firebase.database().ref('comments');

    teacherCommentsRef.once('value', (snapshot) => {
        snapshot.forEach((userSnapshot) => {
            userSnapshot.forEach((commentSnapshot) => {
                const teacherReview = commentSnapshot.child('teacherr').val();
                const teacherName = commentSnapshot.child('teacherm').val();
                
                if (!teacherRatings[teacherName]) {
                    teacherRatings[teacherName] = { sum: 0, count: 0 };
                }
                
                teacherRatings[teacherName].sum += teacherReview;
                teacherRatings[teacherName].count++;
            });
        });

        const averageTeacherReviews = {};
        for (const teacherName in teacherRatings) {
            const { sum, count } = teacherRatings[teacherName];
            averageTeacherReviews[teacherName] = sum / count;
        }

        console.log('Average teacher reviews:', averageTeacherReviews);
    }).catch((error) => {
        console.error('Error calculating average teacher reviews:', error);
    });
}


