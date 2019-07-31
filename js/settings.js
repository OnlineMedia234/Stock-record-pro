const app_name = "Mobile Stock";
var developer_url = "https://onlinemedia.com.ng";
var developer_email = "admin@onlinemedia.com.ng";
var supervisor = "OnlineMedia";


//var url = 'http://app.onlinemedia.com.ng/mobileChat/api.php';
let url = '';

let env,server_upload_url,app_path = '';
env = "locals";

let base_url = '';

if(env == "local"){
    /*url = "http://project.apps/Auction/api.php";
    base_url = "http://project.apps/Auction";
    server_upload_url = "http://project.apps/cdn/";*/

    url = "http://mob.apps/stock/api.php";
    base_url = "http://mob.apps/stock";
    server_upload_url = "http://localhost/cdn/";

}else{
    base_url = "https://projects.onlinemedia.com.ng/Stock";
    url = 'https://projects.onlinemedia.com.ng/Stock/api.php';
    server_upload_url = "https://cdn.uwansell.com.ng/apps/";
}

app_path = "Stock/";
