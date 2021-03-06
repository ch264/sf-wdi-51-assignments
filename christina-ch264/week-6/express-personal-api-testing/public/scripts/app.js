console.log("Sanity Check: JS is working!");

$(document).ready(function(){
    // array to hold videogames 
    let allVideogames = [];
    // empty div container to render videogames
    let $videogameList;
    $videogameList = $('#listview');


    ///////////////////////////////////////////////////////////////////////////
    /// GET
    ///////////////////////////////////////////////////////////////////////////
    
    //Read all Videogames
    $.ajax({
        method: 'GET',
        url: '/api/videogames',
        success: handleSuccess,
        error: handleError
    })


    ///////////////////////////////////////////////////////////////////////////
    /// POST
    ///////////////////////////////////////////////////////////////////////////

    // create a new Videogame, listen for submit on form
    $('#videogame-form').on('submit', function(event) {
        event.preventDefault();
        // console.log('new game serializesd',  $(this).serializeArray())
        console.log('create clicked');

        let newVideogameData = $(this).serialize();
        // create a new videogame
        $.ajax({
            method: 'POST',
            url: '/api/videogames',
            data: newVideogameData,
            success: handleCreateSuccess,
            error: handleCreateError
        });
    });

    //////////////////////////////////////////////////////////////////////////
    /// DELETE
    ///////////////////////////////////////////////////////////////////////////
    $videogameList.on('click', '.videogame-button-delete', function(){
        console.log(`clicked delete, /api/videogames/${ $(this).attr('data-id') }`);

        $.ajax({
            method: 'DELETE',
            url: "/api/videogames/"+$(this).attr('data-id'),
            success: deleteSuccess,
            error: deleteError,
        });
    });

    ///////////////////////////////////////////////////////////////////////////
    /// PUT
    ///////////////////////////////////////////////////////////////////////////

    $videogameList.on('click', '.videogame-button-edit', function () {
        console.log('clicked edit button');
        $(this).parent().find(".edit-input").show();
    });

    $videogameList.on('submit', '.edit-input', function (e) {
        event.preventDefault();

        let videogameId = $(this).attr('data-id');
        console.log(`clicked edit submit button, /api/videogames/${ videogameId }`);

        $.ajax({
            method: "PUT",
            url: `/api/videogames/${ videogameId }`,
            // serialize form data to json
            data: $(this).serialize(),
            success: editSuccess,
            error: function (err) {
                console.log('edit went wrong', err)
            },
            complete: function () {
                console.log(this);
                $('.edit-input').hide();
            }
        });
    });

    ///////////////////////////////////////////////////////////////////////////
    /// FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////

    function getVideogameHtml(videogame) {
        return `
            <hr>
            <div>
                <strong>Videogame:</strong> ${videogame.title}, <strong>Avatar:</strong> ${videogame.avatar}"
                
                <button type="button" name="button" class="videogame-button-delete btn btn-danger pull-right" data-id=${videogame._id}>Delete</button>
                
                <button class="videogame-button-edit btn btn-secondary pull-right">Edit</button>
                
                <form class="edit-input" style="display: none" data-id="${videogame._id}">
                    <input type="text" name="title" value="${videogame.title}" />
                    <input type="text" name="avatar" value="${videogame.avatar}" />
                    <button type="submit" class="videogame-button-edit-submit btn btn-secondary">Save</button>
                </form>
            </div>`;
    }
    
    //maps through array of videogames and returns it as a string
    function getAllVideogamesHtml(videogames) {
        return videogames.map(getVideogameHtml).join("");
    }

    // we empty and re-render the collection each time our post data changes
    function render() {
        $videogameList.empty();
        // pass allVideogames into the template function
        let videogameHtml = getAllVideogamesHtml(allVideogames);
        $videogameList.append(videogameHtml);
    }

    // // note: we empty and re-render the collection each time our todo data changes
    // const renderAll = () => {
    //     // empty existing videogames from view
    //     $videogameList.empty();
    //     // pass in all videogames into template function
    //     allVideogames.forEach( videogame => render(videogame));
    // }

    function handleSuccess(json) {
        allVideogames = json;
        render();
    }

    function  handleError() {
        console.log('something went wrong when rendering Videogames');
        // $('#listview').text('Failed to load books, is the server working?');
    }

    function handleCreateSuccess(json) {
        $('input').val('');
        // console.log(json)
        // add new videogame to all Videogames
        allVideogames.push(json);
        //render one videogame to view
        render(); 
    }

    function handleCreateError() {
        console.log('something went wrong when trying to create');
        // $('#listview').text('Failed to load books, is the server working?');
    }

    // replace videogame with newly updated version (json)
    function editSuccess (videogame) {
        let videogameId = videogame._id;
        // debugger;
        // $(this).parent().parent().find(".videogame-title").html(videogame.title);
        for(var i = 0; i < allVideogames.length; i++) {
            if(allVideogames[i]._id === videogameId) {
                allVideogames.splice(i, 1);
                break;  // we found our videogame - no reason to keep searching (this is why we didn't use forEach)
            }

        console.log(this);
        render();
    }}

    function deleteSuccess(json) {
        let videogame = json;
        console.log('this is json', json)
        let videogameId = videogame._id;
        console.log('delete this videogame with Id:', videogameId);
        // find the videogame with the correct ID and remove it from our allVideogames array
        for(var i = 0; i < allVideogames.length; i++) {
            if(allVideogames[i]._id === videogameId) {
                allVideogames.splice(i, 1);
                break;  // we found our videogame - no reason to keep searching (this is why we didn't use forEach)
            }
        }
        render();
    }

    function deleteError () {
        console.log('delete went wrong');
    }
});
