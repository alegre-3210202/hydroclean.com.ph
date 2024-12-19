// Open the form when "Add Comment" button is clicked
document.getElementById("openFormBtn").addEventListener("click", function () {
    document.getElementById("commentForm").style.display = "block";
});

// Close the form when "Close" button is clicked
document.getElementById("closeFormBtn").addEventListener("click", function () {
    document.getElementById("commentForm").style.display = "none";
});
