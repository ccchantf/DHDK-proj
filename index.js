$(document).ready(function(){
    main();
});


function main(){
    $.ajax({
        method: 'GET',
        url: "docList.json", 
        success: function(docs){
            var docList = $('#docList');
            for (var i=0; i<docs.docList.length; i++){
                var doc = docs.docList[i]
                var li = '<li><a href="#" onclick="load(\' ' + doc.url + '\')">' + doc.label + '</a></li>'
                docList.append(li);
            }
        },
        error: function(){
            alert("No document to show");
        }
    });

    $('#showhistory').click(function(){
        tickCheckbox(this, '.history', 'tickHistory');
        // fillList('.history'); 
    })
    $('#showchara').click(function(){
        tickCheckbox(this, '.chara', 'tickChara');
        // fillList('.chara'); 
    })
    $('#showregion').click(function(){
        tickCheckbox(this, '.region', 'tickRegion');
        // fillList('.region'); 
    });
}

function load(docURL){
    $.ajax({
        method: 'GET',
        url: docURL,
        success: function(docs){
            $('#textContent').html(docs)
            $('#textTitle').html($('#textContent h1'))
            addIds();
            clearList();
        },
        error: function(){
            alert("Fail to load content");
        }
    });
}

function clearList(){
    $('#showList').empty();
    document.getElementById("showchara").checked = false;
    document.getElementById("showhistory").checked = false;
    document.getElementById("showregion").checked = false;
}

function addIds(){
    addId('.history','history');
    addId('.chara', 'chara');
    addId('.region', 'region')
}

function addId(what,classname){
    var items=$(what);
    for(var i=0;i<items.length;i++){
        items[i].id = classname + "-" + i;
    }
}

function tickCheckbox(checkbox, original, extra){
    if (checkbox.checked){
        $(original).addClass(extra);
        fillList(original); 
    }
    else{
        $(original).removeClass(extra);
        $('#showList').empty();
    }
}

function fillList(selectedClass){
    var elements = $(selectedClass);
    var listContainer = $('#showList');
    listContainer.empty();
    for (var i=0; i<elements.length; i++){
        var li=`<li><a href="#" onclick="goto('#${elements[i].id}')">${elements[i].innerHTML}</a></li>`
        listContainer.append(li);
    }
}

function goto(id){
    var $container = $('.left');
    var $target = $(id);
    var t = $target.offset().top - $container.offset().top;

    $container.animate(
        {
            scrollTop: t
        }, 
        200
    );
    // $('.textContent').getElementById(id).scrollIntoView();
}

// theMap

function createMap(){
    try{
        var map = $('.map')[0];
        var center = JSON.parse(map.dataset['center']);
        var zoom = parseInt(map.dataset['zoom']);
        var theMap = L.map('myMap').setView(center,zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
          }).addTo(theMap);

          var japan = L.marker([35.6895, 139.6917]).addTo(theMap);
          var china = L.marker([39.9042, 116.4074]).addTo(theMap);
          var italy = L.marker([41.9028, 12.4964]).addTo(theMap);

          japan.on('click',function(){load('japanese.html')});
          china.on('click',function(){load('chinese.html')});
          italy.on('click',function(){load('italian.html')});

          japan.bindPopup('Japan');
          china.bindPopup('China');
          italy.bindPopup('Italy');
    } catch(e){
        console.log(e)
    }
}

function switchTheme(style){
    $('#style').remove();
    var newStyle = $('<link rel="stylesheet" href="' + style + '.css" id="style">');
    $('head').append(newStyle);
}
