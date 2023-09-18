$(document).ready(function () {
  function addRow() {
    let row = $(this).closest(".row");
    let newRow = row.clone();
    newRow.find('input[type="text"]').val("");
    newRow.insertAfter(row);
  }

  function deleteRow() {
    let row = $(this).closest(".row");
    let numRows = $(".row").length;
    if (numRows > 1) {
      row.remove();
    }
  }

  function addSet() {
    $(".row.exercise").each(function () {
      let checkbox = $('<input type="checkbox" />');
      $(this).find(".checkboxes").append(checkbox);
    });
  }

  function deleteSet() {
    $(".row.exercise").each(function () {
      let checkboxes = $(this).find(".checkboxes input");
      if (checkboxes.length > 1) {
        checkboxes.last().remove();
      }
    });
  }

  function clearChecks() {
    $('input[type="checkbox"]').each(function () {
      $(this).prop("checked", false);
    });
  }

  function loadWorkout() {
    $("#workout-list").empty();
    $("#load-modal p").hide();
    const workouts = Object.keys(localStorage).filter((key) => {
      let item;
      try {
        item = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        return false;
      }
      return item.type === "workout";
    });
    $("#load-modal").show();
    if (workouts.length > 0) {
      workouts.forEach((workout) => {
        let item = JSON.parse(localStorage.getItem(workout));
        let date = new Date(item.date).toLocaleString();
        let button = $(
          `<button class="workout-button" data="${workout}">${workout} (${date})</button>`
        );
        button.on("click", function () {
          $("#rows-container").html("");
          item.rows.forEach((row, index) => {
            let newRow = $(initialRows);
            newRow.find(".find").val(row.find);
            newRow.find(".replace").val(row.replace);
            newRow.find(`.mode input`).attr("name", `mode-${index + 1}`);
            newRow
              .find(`.mode input[value="${row.mode}"]`)
              .prop("checked", true);
            $("#rows-container").append(newRow);
          });
          updateLabels();
          $("#load-modal").hide();
        });
        let row = $('<div class="row"></div>');
        row.append(button);
        row.append(
          "<i class='fa-regular fa-square-minus delete-workout' title='Delete Workout'></i>"
        );
        $("#workout-list").append(row);
      });
    } else {
      $("#load-modal p").show();
    }
  }

  $("body").on("click", ".add-row", addRow);
  $("body").on("click", ".delete-row", deleteRow);
  $("body").on("click", ".add-set", addSet);
  $("body").on("click", ".delete-set", deleteSet);
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
  $("#load-dialog").on("click", loadWorkout);
});
