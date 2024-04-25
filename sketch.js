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
  "History": ["Teacher7", "Teacher8", "Teacher9"]
};

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
    commentInput.size(375);
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
                    logoutButton.show();
                    signInButton.hide();
                    commentInput.show();
                    saveCommentButton.show();
                    slider.show();
                    slider2.show();
                    slider3.show();
                    teacherDropdown.show();
                    classDropdown.show();
                    userName = user.displayName || "User";
                    print("bob");
                    lwhs = 1;
                    fc = 1;
                  } else {
                    signInButton.hide();
                    logoutButton.show();
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

    fetchComments(); // Fetch existing comments from Firebase
}

function draw() {
    background(220);
    // Show welcome message near logout button if user is signed in
    if (userName) {
        if (fc == 1){
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
            displayComments(); 

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
    const teacherr = slider3.value();
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


function displayComments() {
    
    function displayComments() {
        for (let comment of comments) {
            // Check if the comment and username are defined
            if (comment.text !== undefined && comment.username !== undefined) {
                fill(random(255), random(255), random(255)); // Choose a random color
                textSize(16);
                textFont("Sans-serif");
                // Display comment at a random position
                text(`${comment.username}: ${comment.text}`, random(width), random(height));
            }
        }
    }

}

function fetchComments() {
    // Reference to your comments node in Firebase Realtime Database
    let commentsRef = firebase.database().ref('comments');
    commentsRef.on('value', (snapshot) => {
        comments = []; // Reset comments array
        snapshot.forEach((childSnapshot) => {
            let comment = childSnapshot.val();
            comments.push({
                username: comment.username,
                text: comment.comment,
                // You can add more details here if needed
            });
        });
        redraw(); // Redraw the canvas to display new comments
    });
}
