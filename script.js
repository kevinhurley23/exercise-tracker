$(document).ready(function () {
  const exerciseTemplate = document.querySelector(".exercise");

  function addRow() {
    let row = $(this).closest(".exercise");
    let newRow = row.clone();
    newRow.find('input[type="text"]').val("");
    newRow.insertAfter(row);
    $(".exercise").each(function (i) {
      $(this).attr("data-index", i + 1);
    });
  }
  $("body").on("click", ".add-row", addRow);

  function deleteRow() {
    let row = $(this).closest(".row.exercise");
    let numRows = $(".row.exercise").length;
    console.log(numRows);
    if (numRows > 1) {
      row.remove();
    }
  }
  $("body").on("click", ".delete-row", deleteRow);

  $(".group").sortable({
    items: ".exercise",
    update: function (event, ui) {
      $(".exercise").each(function (i) {
        $(this).attr("data-index", i + 1);
      });
    },
  });

  function addSet() {
    $(".row.exercise").each(function () {
      let checkbox = $('<input type="checkbox" />');
      $(this).find(".checkboxes").append(checkbox);
    });
  }
  $("body").on("click", ".add-set", addSet);

  function deleteSet() {
    $(".row.exercise").each(function () {
      let checkboxes = $(this).find(".checkboxes input");
      if (checkboxes.length > 1) {
        checkboxes.last().remove();
      }
    });
  }
  $("body").on("click", ".delete-set", deleteSet);

  function clearChecks() {
    $('input[type="checkbox"]').each(function () {
      $(this).prop("checked", false);
    });
  }
  $("body").on("click", ".clear-checks", clearChecks);

  $("#save-dialog").on("click", function () {
    $("#save-modal").show();
    $("#workout-name").focus();
  });
  $("#save-button").on("click", function () {
    let sets = $('.checkboxes:first input[type="checkbox"]').length;
    let exercises = [];
    $('.row.exercise input[type="text"]').each(function () {
      exercises.push($(this).val());
    });
    let currentDate = new Date().toISOString();
    let data = {
      type: "workout",
      date: currentDate,
      data: {
        sets: sets,
        exercises: exercises,
      },
    };
    let workoutName = $("#workout-name").val();
    if (workoutName) {
      localStorage.setItem(workoutName, JSON.stringify(data));
    }
    $("#workout-name").val("");
    $("#save-modal").hide();
  });

  function loadWorkout() {
    // initialize modal
    $("#workout-list").empty();
    $("#load-modal p").hide();
    // get items from local storage
    const workouts = Object.keys(localStorage).filter((key) => {
      let item;
      try {
        item = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        return false;
      }
      return item.type === "workout";
    });
    // Create buttons in modal for each saved workout
    $("#load-modal").show();
    if (workouts.length > 0) {
      workouts.forEach((workout) => {
        let item = JSON.parse(localStorage.getItem(workout));
        let date = new Date(item.date).toLocaleString();
        let button = $(
          `<button class="workout-button" data="${workout}">${workout} (${date})</button>`
        );
        // Function to rebuild markup with the data from the selected workout
        button.on("click", function () {
          $(".group").html("");
          item.data.exercises.forEach((exercise) => {
            let row = $(exerciseTemplate).clone();
            for (let i = item.data.sets; i > 1; i--) {
              row.find(".checkboxes").append(`<input type="checkbox" />`);
            }
            row.find(".exercise-name").val(exercise);
            $(".group").append(row);
          });
          $("#load-modal").hide();
        });
        // Continue adding buttons to modal
        let row = $('<div class="row"></div>');
        row.append(button);
        row.append(
          "<i class='fa-regular fa-square-minus delete-workout' title='Delete Workout'></i>"
        );
        $("#workout-list").append(row);
      });
      // If there are no saved workouts
    } else {
      $("#load-modal p").show();
    }
  }
  $("#load-dialog").on("click", loadWorkout);

  function deleteWorkout() {
    let key = $(this).siblings("button").attr("data");
    localStorage.removeItem(key);
    let row = $(this).closest(".row");
    row.remove();
    if ($("#workout-list").is(":empty")) {
      $("#load-modal p").show();
    }
  }
  $("#workout-list").on("click", ".delete-workout", deleteWorkout);

  $(".modal").on("click", function (event) {
    if (event.target === this) {
      $(".modal").hide();
    }
  });
});
