$(document).ready(function(){
    getData();

    $('.add-task').on('click', function(event) {
        event.preventDefault();
        let createNewTask = {};
        createNewTask['name'] = $('.name').val();
        createNewTask['rep'] = $('.rep').val();
        createNewTask['weight'] = $('.weight').val();
        createNewTask['date'] = $('.date').val();
        createNewTask['units'] = $('.units').val();
        if ($.trim(createNewTask['name']) !== '') {
            $.ajax({
                url: '/tasks',
                method: 'POST',
                data: createNewTask,
                success: getData
            });
        }
    });
});

let $editContainer = $('.edit-form-container'),
    $workoutContainer = $('.workout-table-container'),
    $mainForm = $('#workout-submission');


// Get row ID
function getId(event) {
    return $(event.target).parent('tr').data('id');
}

// Generic Edit form Function
function editForm(event, id) {
    $editContainer.html('');
    // Edit Form HTML
    let form = '<h3>Edit Form</h3><form class="edit-form">' + $mainForm.html() + '</form>';
    $editContainer.append(form);
    $editContainer.find('.add-task').toggleClass('add-task edit-task');
    $.ajax({
        url: '/tasks?id=' + id,
        success: function(data) {

            let $eform = $('.edit-form');
            let obj = JSON.parse(data.results);
            $eform.find('.name').val(obj[0].name);
            $eform.find('.rep').val(obj[0].rep);
            $eform.find('.weight').val(obj[0].weight);
            $eform.find('.date').val(obj[0].date);
            $eform.find('.units').val(obj[0].units);
            $eform.on('click', '.edit-task', function(event) {
                event.preventDefault();
                let str = '';
                str += '?id=' + id;
                str += '&name=' + $eform.find('.name').val();
                str += '&rep=' + $eform.find('.rep').val();
                str += '&weight=' + $eform.find('.weight').val();
                str += '&date=' + $eform.find('.date').val();
                str += '&units=' + $eform.find('.units').val();
                if ($.trim($eform.find('.name').val()) !== '') {
                    $.ajax({
                        method: 'PUT',
                        url: '/tasks' + str,
                        success: getData
                    });
                }
            });
        }
    });
}

function addEventListener() {
    // Delete Button Listener
    $('.delete').on('click', function(event) {
        let id = getId(event);
        $.ajax({
            url: '/tasks?id=' + id,
            method: 'DELETE',
            success: getData
        });
    });
    // Edit Button Listener
    $('.edit').on('click', function(event) {
        let id = getId(event);
        editForm(event, id);
    });
}

// Rendering function
function render(data) {
    let json = JSON.parse(data.results);

    $workoutContainer.html('');

    if (json.length > 0) {
        let table = document.createElement('table');
        let tableBody = document.createElement('tbody');
        let tr = document.createElement('tr');
        for (let key in json[0]) {
            if (key !== 'id') {
                let th = document.createElement('th');
                th.appendChild(document.createTextNode(key.toUpperCase()));
                tr.appendChild(th);
            }
        }
        let th = document.createElement('th');
        tr.appendChild(th);
        tr.appendChild(th);
        tableBody.appendChild(tr);
        for (let i = 0; i < json.length; i++) {
            tr = document.createElement('tr');
            for (let j in json[i]) {
                if (j !== 'id' && j !== 'units') {
                    let td = document.createElement('td');
                    let label = json[i][j];
                    td.appendChild(document.createTextNode(label));
                    tr.appendChild(td);
                }
                else if (j === 'units') {
                    let unit = json[i][j];
                    let td = document.createElement('td');
                    if (unit === 0 || unit === 'kg') {
                        td.appendChild(document.createTextNode('kg'));
                        tr.appendChild(td);
                    } else {
                        td.appendChild(document.createTextNode('lbs'));
                        tr.appendChild(td);
                    }
                }
                else {
                    tr.setAttribute('data-id', json[i][j]);
                }
            }
            // Create Delete Button
            let del = document.createElement('button');
            del.className = 'btn btn-delete delete';
            del.appendChild(document.createTextNode('delete'));
            // Create Edit Button
            let edit = document.createElement('button');
            edit.className = 'btn btn-edit edit';
            edit.appendChild(document.createTextNode('edit'));
            // Append Delete Button
            tr.appendChild(del);
            tableBody.appendChild(tr);
            // Append Edit Button
            tr.appendChild(edit);
            tableBody.appendChild(tr);
        }
        table.appendChild(tableBody);
        let div = document.getElementsByClassName('workout-table-container')[0];
        div.appendChild(table);
    } else {
        $workoutContainer.html('No records to show');
    }
    addEventListener();
}

function getData() {
    $editContainer.html('');
    $.ajax({
        url: '/tasks',
        dataType: 'json',
        success: render
    });
}
