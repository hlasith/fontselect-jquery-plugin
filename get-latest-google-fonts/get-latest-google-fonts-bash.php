<?php
/*
* jQuery.fontselect - A font selector for the Google Web Fonts api
* Tom Moor, http://tommoor.com
* Copyright (c) 2011 Tom Moor
* MIT Licensed
* @version 0.1
*
* Update by Migli - http://codecanyon.net/user/migli
*
* This Update will get all latest Google fonts with all variants (font-weights + font-styles)
* And generate a list you can copy/paste in jquery.fontselect.min.js
*
* To change query, ie filter styles, change sorting, use built-in Google tool at https://developers.google.com/apis-explorer/?hl=fr#p/webfonts/v1/webfonts.webfonts.list
*/

// USE YOUR OWN GOOGLE API KEY, THIS ONE WILL NOT BE ALLOWED
// Get your free own key at https://console.developers.google.com/projectselector/apis/credentials
// creates a bash script to use with https://github.com/neverpanic/google-font-download
$google_api_key = 'AIzaSyD8D9iru_TSvGkjTbC_lEE5cl_rXmPeWnE';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Get Google Latest Fonts</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
</head>
<body>
    <div class="container">

        <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
                <h1>Get Google Latest Fonts</h1>
                <p class="lead">This ugly page should get &amp; display all latest available Google fonts in the textarea below.</p>
                <p>Once done, copy/paste this list into your jquery.fontselect.min.js.</p>
                <p>You have first to get an API key from Google at https://console.developers.google.com/projectselector/apis/credentials</p>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-6 col-xs-offset-3">
                <form name="sort-form" action="" method="GET" role="form">
                    <div class="form-group">
                        <label for="">Sort </label>
                        <select name="sort" class="form-control" required="required">
                            <option value="alpha">Sort alphabetically</option>
                            <option value="date">Sort by date added</option>
                            <option value="popularity">Sort by popularity</option>
                            <option value="style">Sort by number of styles</option>
                            <option value="trending">Sort by trending</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
                <h3 id="result-count"></h3>
                <textarea id="font-list" cols="120" rows="30"></textarea>
            </div>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script type="text/javascript">
        $('form[name="sort-form"]').on('submit', function (e) {
            e.preventDefault();
            var sort = $('select[name="sort"]').val();
            $.ajax({
                url: 'https://www.googleapis.com/webfonts/v1/webfonts?sort=' + sort + '&fields=items(family%2Cvariants)&key=<?php echo $google_api_key; ?>',
                type: 'GET'
            }).done(function (data) {
                var numberOfFonts = data.items.length,
                currentFont,
                output = '';
                $('#result-count').html(numberOfFonts + ' fonts found');
                for (var i = 0; i < data.items.length; i++) {
                    currentFont = data.items[i];
                    output += "sh ./google-font-download";
                    var currentFontFamilyFile = currentFont.family.replace(/ /g, '_');
                    for (var j = 0; j < currentFont.variants.length; j++) {
                        output += ' "' + currentFont.family + ':' + currentFont.variants[j] + '"';
                    }

                    output += " -o"+currentFontFamilyFile+".css;\n"
                }

                // remove ':regular' and last comma
                output = output.replace(/:regular/g, '');
                $('#font-list').text(output.slice(0,-1));
            }).fail(function (data, statut, error) {
                console.log(error);
            });

            return;
        });
    </script>
</body>
</html>
