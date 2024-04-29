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
let classes = {
    "Select Class": [""],
  "Science": ["Teacher4", "Teacher5", "Teacher6"],
  "History": ["Teacher7", "Teacher8", "Teacher9"],
  "Physics": ["Teacher4","Teacher1"]
};
let classFavorites = [];
let reviews = 0; //0 is no review
let viewreviews = 0; //0 is not viewing reviews
let viewClassSelect = '';
let viewAVGClass = '';
let teacherAVGClass = {};
let classSelectionMade = false;
let happyImage, midImage, sadImage, greatImage, madImage;
let comments = []; // Array to store comments fetched from Firebase
let textComments = [];
var SIBx = 40;
var SIBy = 40;
var LOBx = 1000;
var LOBy = 55;
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
    resizeCanvas(windowWidth, windowHeight);
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
    logoutButton.size(80,40);
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
    homepagebutton.position( 50, 55);
    homepagebutton.size(80,40);
    homepagebutton.mousePressed(toggleVariable3);
    homepagebutton.hide();

    viewclassDropdown = createSelect();
    viewclassDropdown.style("font-size", "16px");
    viewclassDropdown.style("text-align", "center");
    viewclassDropdown.position(500, 140);
    viewclassDropdown.size(200,40);
    for (let cls in classes) {
        viewclassDropdown.option(cls);
    }
    viewclassDropdown.changed(classSelectionChanged);
    viewclassDropdown.hide();

    saveFavoriteButton = createButton('Add to Favorites');
    saveFavoriteButton.style("font-size", "15px");
    saveFavoriteButton.style("text-align", "center");
    saveFavoriteButton.position(500, 700);
    saveFavoriteButton.size(200,40);
    saveFavoriteButton.mousePressed(toggleVariable4);
    saveFavoriteButton.hide();


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
                        saveFavoriteButton.hide();
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
                        saveFavoriteButton.show();
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
                        saveFavoriteButton.hide();
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
                    saveFavoriteButton.hide();
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
            userName = "";
            print("joe");
        }
    });

    
}

function draw() {
    resizeCanvas(windowWidth, windowHeight);
    background('#6F6F6F');

    // Show welcome message near logout button if user is signed in
    if (userName) {
        if (fc == 1){ //student
            if (reviews == 1){ //write a review
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
            } else if (viewreviews == 1){ //view reviews
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
                selectedClass = viewclassDropdown.value();
                viewclassDropdown.changed(classSelectionChanged);
                if (classSelectionMade == true) {
                    // Display the text
                    if (viewClassSelect == 'Select Class'){

                    }else{
                        textSize(20);
                        textAlign(CENTER, CENTER);
                        const rating = Number(viewAVGClass).toFixed(2);
                        text(viewClassSelect + "'s Average Review: " + rating +'/10', windowWidth/2, 230);
                        const textCommentsRef = textComments;
                        console.log(textCommentsRef)
                        let yPos = 180;
                        for (let i = 0; i < textCommentsRef.length; i++) {
                            const review = textCommentsRef[i];
                            let  plural = ''
                            let timeType = ''
                            const difference_seconds = timeDifference(review.time);
                            console.log(timeDifference(review.time));
                            if (difference_seconds >= 60){
                                convertedTime = Math.floor(difference_seconds/60)
                                timeType = 'minute'
                                if (convertedTime >= 60){
                                    timeType = 'hour'
                                    convertedTime = Math.floor(convertedTime/60)
                                    if(convertedTime >= 24){
                                        timeType = 'day'
                                        convertedTime = Math.floor(convertedTime/24)
                                        if(convertedTime >= 7){
                                            convertedTime = Math.floor(convertedTime/7)
                                            timeType = 'week'
                                            if(convertedTime >= 30){
                                                timeType = 'month'
                                                convertedTime = Math.floor(convertedTime/30.4375)
                                            }
                                        }
                                    }
                                }
                              }else{
                                timeType = 'seconds'
                              }
                              if (convertedTime >= 2){
                                plural = 's'
                              }
                            const textToShow = review.review
                            // Split the text into lines with 30 characters each
                            const lines = splitTextIntoLines(textToShow);
                            textSize(18);
                            text(review.class + ' (' + review.teacher + '):',1015,yPos)
                            yPos += 25;
                            // Display each line of text
                            for (let j = 0; j < lines.length; j++) {
                                const line = lines[j];
                                textAlign(CENTER, CENTER);
                                textSize(17);
                                text(line, 1015, yPos); // Display the line of text at the calculated y position
                                textSize(10);
                                
                                yPos += 20; // Move to the next line
                            }
                            yPos+= 0;
                            text(convertedTime + ' ' + timeType + plural +' ago',1015,yPos);
                            yPos += 20;
                            
                        }
                        yPos = 320; // Starting y-position for teacher reviews
                        for (const teacherName in teacherAVGClass) {
                            const teacherReview = Number(teacherAVGClass[teacherName]).toFixed(2);
                            textAlign(CENTER, CENTER);
                            textSize(18);
                            text(teacherName + "'s Average Review: " + teacherReview + '/10', windowWidth/2, yPos);
                            yPos += 50; // Increase y-position for the next teacher's review
                        }
                    }

                } else {
                    // If class selection hasn't been made or the asynchronous operation hasn't completed yet, display a message indicating that
                    textSize(40);
                    textAlign(CENTER, CENTER);
                    text("Please make a class selection", windowWidth/2, 300);

                }
                fill(0);
                textFont(customFont);
                textSize(20); // Smaller text size
                textAlign(RIGHT, TOP);
                text(`Welcome ${userName}`, windowWidth - 130, 15);
                line(0,100,10000,100);
                line(820,100,820,10000);
                line(300,100,300,10000)
                text('Reviews',1050,120)
                
                
            }else{ //menu
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
                classSelectionChanged();
                textSize(25)
                textAlign(CENTER,CENTER);
                text('Please Choose What You Would Like To Do',windowWidth/2 + 20,100);
                fill(0);
                textFont(customFont);
                textSize(20); // Smaller text size
                textAlign(RIGHT, TOP);
                text(`Welcome ${userName}`, windowWidth - 130, 15);
            }
            
        } else { 
            fill(0);
            textFont(customFont);
            textSize(20); // Smaller text size
            textAlign(RIGHT, TOP);
            text(`Welcome ${userName}`, windowWidth - 130, 15);
        }
    }
    if (lwhs == 0) { //nonlwhs
        textFont(customFont);
        textAlign(CENTER, CENTER);
        textSize(40);
        text("Please Log In With Your School Email",windowWidth/2,windowHeight/2 - 150)
        if (signedIn == 1){
            textSize(20);
            text("Wrong Email",windowWidth/2,200);
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
    lwhs = 0;
    signedIn = 0;
    firebase.auth().signOut().catch((error) => {
        console.error("Sign out error:", error.message);
    });
}
function classSelectionChanged() {
    const selectedClass = viewclassDropdown.value();
    viewClassSelect = selectedClass;
    classSelectionMade = true;
    toggleVariable4()
    calculateAverageClassReviews()
        .then((averageClassReviews) => {
            const selectedClass = viewclassDropdown.value();
            const averageRating = averageClassReviews[selectedClass];
            console.log('Average rating for selected class:', averageRating);
            // You can use averageRating to create text or perform any other operation
            viewAVGClass = averageRating; // Assign averageRating to viewAVGClass
            viewClassSelect = selectedClass;
            print('bob')
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    calculateAverageTeacherReviews(selectedClass)
        .then((averageTeacherReviews) => {
            const selectedClass = viewclassDropdown.value();
            teacherAVGClass = averageTeacherReviews; // Assign average teacher reviews to teacherAVGClass
            viewClassSelect = selectedClass;
        })
        .catch((error) => {
            console.error('Error calculating average teacher reviews:', error);
    });
    textReviews(selectedClass)
        .then((textReviews) => {
            const selectedClass = viewclassDropdown.value();
            textComments = textReviews; // Assign average teacher reviews to teacherAVGClass
            viewClassSelect = selectedClass;
        })
        .catch((error) => {
            console.error('Error Finding Reviews:', error);
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
function toggleVariable4(selectedClass){
    classFavorites.push(selectedClass);
    console.log("Selected classes:", classFavorites);
}


function calculateAverageClassReviews() {
    return new Promise((resolve, reject) => {
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
            resolve(averageClassReviews);
        }).catch((error) => {
            console.error('Error calculating average class reviews:', error);
            reject(error);
        });
    });
}

function calculateAverageTeacherReviews(selectedClass) {
    return new Promise((resolve, reject) => {
        const teacherRatings = {};
        const teacherCommentsRef = firebase.database().ref('comments');

        teacherCommentsRef.once('value', (snapshot) => {
            snapshot.forEach((userSnapshot) => {
                userSnapshot.forEach((commentSnapshot) => {
                    const teacherReview = commentSnapshot.child('teacherr').val();
                    const teacherName = commentSnapshot.child('teacherm').val();
                    const className = commentSnapshot.child('classm').val();

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

            console.log('Average teacher reviews for', selectedClass + ':', averageTeacherReviews);
            resolve(averageTeacherReviews);
        }).catch((error) => {
            console.error('Error calculating average teacher reviews:', error);
            reject(error);
        });
    });
}
function textReviews(selectedClass) {
    return new Promise((resolve, reject) => {
        const textReviews = [];
        const textReviewsRef = firebase.database().ref('comments');

        textReviewsRef.once('value', (snapshot) => {
            snapshot.forEach((userSnapshot) => {
                userSnapshot.forEach((commentSnapshot) => {
                    const textReview = commentSnapshot.child('comment').val();
                    const teacherName = commentSnapshot.child('teacherm').val();
                    const className = commentSnapshot.child('classm').val();
                    const timestamp = commentSnapshot.child('timestamp').val();


                    // Check if the comment belongs to the selected class
                    if (className === selectedClass) {
                        if (textReview == ''){

                        }else{
                            textReviews.push({ class: className, teacher: teacherName, review: textReview, time: timestamp });
                        }

                    }
                });
            });
            console.log('Reviews for', selectedClass + ':', textReviews);
            // Resolve the promise with the list of teacher reviews
            resolve(textReviews);
        }).catch((error) => {
            console.error('Error finding reviews:', error);
            reject(error);
        });
    });
}
function splitTextIntoLines(text) {
    const lines = [];
    let line = '';
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
        if (line.length + words[i].length <= 40) {
            line += words[i] + ' ';
        } else {
            lines.push(line);
            line = words[i] + ' ';
        }
    }
    if (line !== '') {
        lines.push(line);
    }
    return lines;
}
function timeDifference(unix_time) {
    let current_time = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    let difference_seconds = current_time - Math.floor(unix_time/1000);
    return difference_seconds;
  }
