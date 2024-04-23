let signInButton, logoutButton, commentInput, saveCommentButton;
let slider;
let userName = "";
let customFont;

let comments = []; // Array to store comments fetched from Firebase
var SIBx = 20;
var SIBy = 20;
var LOBx = 1000;
var LOBy = 75;
var CIBx = 420;
var CIBy = 512;
var SCBx = 50;
var SCBy = 50;


function preload() {
    // Load the font file
    customFont = loadFont('Poppins-Regular.ttf');
  }
  


function setup() {
    createCanvas(windowWidth, windowHeight);

    // Initialize the "Sign in with Google" button
    signInButton = createButton('Sign In with Google');
    signInButton.position(SIBx, SIBy);
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
    commentInput.size(250);
    commentInput.hide();

    // Button to save the comment
    saveCommentButton = createButton('Save Comment');
    saveCommentButton.position(SCBx, SCBy);
    saveCommentButton.mousePressed(saveComment);
    saveCommentButton.hide();

    slider = createSlider(1, 10, 1); // Create slider with range from 1 to 10, starting at 1
    slider.position(420, 200);
    slider.style('width', '360px');
    slider.hide();

    // Adjust UI elements if the window is resized
    windowResized();

    // Authentication state observer
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            signInButton.hide();
            logoutButton.show();
            commentInput.show();
            saveCommentButton.hide();
            slider.show();
            userName = user.displayName || "User";
            print("bob");
        } else {
            signInButton.show();
            logoutButton.hide();
            commentInput.hide();
            saveCommentButton.hide();
            slider.hide();
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
        fill(0);
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
    
        
        // Display selected value
        textAlign(CENTER, CENTER);
        textSize(15);
        text("Selected: " + slider.value(), width/2, 475);
        displayComments(); 
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
    const userId = firebase.auth().currentUser.uid;
    // Save the comment to Firebase; adjust the path as necessary for your data structure
    firebase.database().ref('comments/' + userId).push({
        username: userName,
        comment: comment,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        console.log("Comment saved successfully.");
        commentInput.value(''); // Clear the input after saving
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
