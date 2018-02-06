var DEFAULT_API_URL = "http://pihole/admin",
    apiURL = document.getElementById("apiURL"),
    apiToken = document.getElementById("apiToken"),
    piholeStatus = document.getElementById("piholeStatus"),
    endpoint = "/api.php";

function save_url() {
    console.log("saving: " + this.value);
    chrome.storage.sync.set({
        apiURL: this.value
    }, function() {
        console.log("Saved");
    });
}

function save_token() {
    console.log("saving: " + this.value);
    chrome.storage.sync.set({
        apiToken: this.value
    }, function() {
        console.log("Saved");
    });
}

// Localstorage
function restore_options() {
    // Use defaults
    chrome.storage.sync.get({
        apiURL: DEFAULT_API_URL,
        apiToken: '000-000-000'
    }, function(items) {
        apiURL.value = items.apiURL;
        apiToken.value = items.apiToken;
    });
}

function toggleState() {
    var apiurl = apiURL.value + endpoint,
        auth = apiToken.value;
    if (!piholeStatus.checked) {
        apiurl += "?disable&auth=" + auth;
    } else {
        apiurl += "?enable&auth=" + auth;
    }
    $.ajax({
            type: 'POST',
            url: apiurl,
        })
        .done(function(data) {
            console.log(data);
        })
        .fail(function(data) {
            console.log(data);
        });
}


apiURL.addEventListener('input', save_url);
apiToken.addEventListener('input', save_token);
piholeStatus.addEventListener('change', toggleState);
document.addEventListener('DOMContentLoaded', restore_options);


function check_status() {
    var url = apiURL.value

    $.ajax({
            type: 'GET',
            url: url + "?status",
        })
        .done(function(data) {
            $('#status').bootstrapSwitch('toggleDisabled');
            if (data.status == 1) {
                $('#status').bootstrapSwitch('state', true, true);
            } else {
                $('#status').bootstrapSwitch('state', false, true);
            }
        })
        .fail(function(data) {
            $('form').append('<div id="alert" name="alert" class="alert alert-danger">Pi-Hole state toggling was not succesful</div>').hide().fadeIn("slow");
            $('#alert').delay(2000).fadeOut(5000, function() {
                $(this).remove();
            });
            console.log(data);
        });

}
