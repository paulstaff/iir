<?php

    $request = isset($_POST['request']) ? json_decode($_POST['request']) : null;

    $response['code'] = 2000;
    $response['text'] = "Incomplete Request!";
    $response['body'] = "";

    switch($request->action) {
        case "addItem":

            if($request->payload) {
                $response = addItem($response, $request->payload);
            } else {
                $response['code'] = 2002;
                $response['text'] = "No item provided!";
            }

            break;
        case "editItem":

            if($request->payload) {
                $response = editItem($response, $request->payload);
            } else {
                $response['code'] = 2002;
                $response['text'] = "No item provided!";
            }

            break;
        case "removeItem":

            if($request->payload) {
                $response = removeItem($response, $request->payload);
            } else {
                $response['code'] = 2002;
                $response['text'] = "No item provided!";
            }

            break;
        case "testItems":

            $response = testItems();

            break;
        default:

            $response['code'] = 2001;
            $response['text'] = "No action provided!";

            break;
    }

    echo json_encode($response);



    // Function to retrieve associative array from JSON file
    function openDataFile() {
        return json_decode(file_get_contents("data.json"), true);
    }

    // Function to write associative array to JSON file
    function writeDataFile($data) {
        $fh = fopen("data.json", 'w');
        fwrite($fh, json_encode($data));
        fclose($fh);
    }

    // Function to add item to data store
    function addItem($response, $item) {

        // Retrieve data
        $data = openDataFile();

        // Generate ID and add item to array
        $id = uniqid();
        $data[$id] = $item;

        // Write data file
        writeDataFile($data);

        // Set response
        $response['code'] = 1000;
        $response['text'] = "Success! Item Added!";

        // Return response
        return $response;
    }

    // Function edit item in data store
    function editItem($response, $item) {

        // Retrieve data
        $data = openDataFile();

        // Retrieve item ID and update item in array
        $id = $item->id;
        $data[$id] = $item;

        // Write data file
        writeDataFile($data);

        // Set response
        $response['code'] = 1000;
        $response['text'] = "Success! Item Edited!";

        // Return response
        return $response;
    }

    // Function to remove item from data store
    function removeItem($response, $item) {

        // Retrieve data
        $data = openDataFile();

        // Retrieve item ID and update item in array
        $id = $item->id;
        unset($data[$id]);

        // Write data file
        writeDataFile($data);

        // Set response
        $response['code'] = 1000;
        $response['text'] = "Success! Item Removed!";

        // Return response
        return $response;
    }

    // Function to test all items in data store
    function testItems() {

        // Retrieve data
        $data = openDataFile();

        foreach($data as &$item) {

            // Get cURL resource
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_URL => $item['uri'],
                CURLOPT_USERAGENT => 'IIR cURL Request'
            ));

            // Send request
            if(curl_exec($curl)) {
                $item['error'] = false;
                $item['response'] = curl_getinfo($curl);
            } else {
                $item['error'] = true;
                $item['response'] = [];
                $item['response']['code'] = curl_errno($curl);
                $item['response']['text'] = curl_error($curl);
            }

            // Close request to clear up some resources
            curl_close($curl);

        }

        $response['code'] = 1000;
        $respnose['text'] = "Success! Data returned!";
        $response['body'] = $data;

        return $response;
    }

?>