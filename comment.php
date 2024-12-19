<?php session_start(); ?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Comment Button</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <button class="add-comment-btn" id="openFormBtn">Add Comment</button>

    <!-- Popup form -->
    <div id="commentForm" class="form-popup" style="display: none;"> 
        <div class="card p-3 mt-3">
            <form class="form-container" id="commentFormElement" action="sendmail.php" method="POST">
                <div class="mb-3">
                    <textarea name="message" id="comment" class="form-control" rows="3" placeholder="Type your comment here..." required></textarea>
                </div>
                <div class="button-group mb-3">
                    <button type="submit" name="submitMessage" class="btn btn-primary">Submit</button>
                    <button type="button" class="btn btn-danger" id="closeFormBtn">Close</button>
                </div>
            </form>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>

        var messageText = "<?= $_SESSION['status'] ?? '' ?>";
        if(messageText != ''){
        
        Swal.fire({
         title: "Thank you!",
         text: messageText,
        icon: "success"
        });
        <?php unset ($_SESSION['status']); ?>
        }
    </script>
</body>
</html>
