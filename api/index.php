<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/sessions', 'getSessions');
$app->get('/assessments/:id', 'getAssessment');
$app->get('/sessions/:id',	'getSession');
$app->get('/sessions/search/:query', 'findByName');
$app->post('/sessions', 'addSession');
$app->put('/sessions/:id', 'updateSession');
$app->delete('/sessions/:id',	'deleteSession');
$app->get('/form', 'getFormData');
$app->post('/contacts', 'addContact');
$app->get('/results/:id', 'getResults');

$app->run();

function getSessions() {
	$sql = "select * FROM sessions ORDER BY company";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$sessions = $stmt->fetchAll();
		$db = null;

        for($i = 0; $i < sizeof($sessions); ++$i)
        {


            $cont = (getContact($sessions[$i]['main_contact']));
            $sessions[$i]['main_contact_fname'] = $cont->fname;
            $sessions[$i]['main_contact_lname'] = $cont->lname;
            $sessions[$i]['main_contact_role'] = $cont->role;

            $intstring = ($sessions[$i]['interviewees']);
            $ints = explode(",", $intstring);

            //contacts
            $sessions[$i]['interviewees_list'] = array();
            //TODO: Fix this, no need to make all these queries
            $sql = "SELECT * FROM contacts WHERE id IN ($intstring)";
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $conts = $stmt->fetchAll(PDO::FETCH_OBJ);
            $db = null;
            for($j = 0; $j < sizeof($conts); ++$j)
            {
                array_push($sessions[$i]['interviewees_list'], $conts[$j]);
            }

            $modstring = ($sessions[$i]['modified']);
            $mods = explode(",", $modstring);
            $sessions[$i]['dates_modified_list'] = array();
            for($k = 0; $k < sizeof($mods); ++$k)
            {
                array_push($sessions[$i]['dates_modified_list'], $mods[$k]);
            }
        }
        echo json_encode($sessions);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getSession($id) {
	$sql = "SELECT * FROM sessions WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$sessions = $stmt->fetchObject();
		$db = null;
		return json_encode($sessions);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getContact($id)    {
    $sql = "SELECT * FROM contacts WHERE id=:id";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $id);
    		$stmt->execute();
    		$contact = $stmt->fetchObject();
    		$db = null;
    		return $contact;
    	} catch(PDOException $e) {
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
}

function getAssessment($id) {
    $sql = "SELECT * FROM assessments WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $assessment = $stmt->fetchObject();
        $db = null;

        $assess = new stdClass();
        $assess->name = $assessment->name;
        $assess->id = $assessment->id;
        $assess->total_questions = $assessment->total_questions;
        $assess->total_answered = $assessment->total_answered;


        //categories
        $assess->categories = array();
        $sql = "SELECT * FROM categories WHERE id IN ($assessment->categories)";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $cats = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        for($i = 0; $i < sizeof($cats); ++$i)
        {
            $cats[$i]->questions = array();
            array_push($assess->categories, $cats[$i]);
        }


        //questions
        $sql = "SELECT * FROM questions WHERE id IN ($assessment->questions)";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_OBJ);
        for($i = 0;$i < sizeof($questions); ++$i)   {
            for($j = 0; $j < sizeof($assess->categories); ++$j)
            {
                if($questions[$i]->category == $assess->categories[$j]->id) {
                    //answers
                    $ans = $questions[$i]->answers;
                    $sql = "SELECT * FROM answers WHERE id IN ($ans)";
                    $db = getConnection();
                    $stmt = $db->prepare($sql);
                    $stmt->execute();
                    $answers = $stmt->fetchAll(PDO::FETCH_OBJ);
                    $questions[$i]->answers = $answers;
                    array_push($assess->categories[$j]->questions, $questions[$i]);
                }
            }
        }


        echo json_encode($assess);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getFormData() {
	$sql = "SELECT * FROM industries";
	$formdata = new stdClass();
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$formdata->industries = array();
		$industries = $stmt->fetchAll(PDO::FETCH_OBJ);
		for($i = 0; $i < sizeof($industries); ++$i)
        {
             array_push($formdata->industries, $industries[$i]);
        }
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	$sql = "SELECT * FROM company_sizes";
    	try {
    		$db = getConnection();
    		$stmt = $db->prepare($sql);
    		$stmt->bindParam("id", $id);
    		$stmt->execute();
    		$formdata->company_sizes = array();
    		$company_sizes = $stmt->fetchAll(PDO::FETCH_OBJ);
    		for($i = 0; $i < sizeof($company_sizes); ++$i)
            {
                 array_push($formdata->company_sizes, $company_sizes[$i]);
            }
    		$db = null;
    	} catch(PDOException $e) {
    		echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
    $sql = "SELECT * FROM assessments";
        	try {
        		$db = getConnection();
        		$stmt = $db->prepare($sql);
        		$stmt->bindParam("id", $id);
        		$stmt->execute();
        		$formdata->assessments = array();
        		$assessments = $stmt->fetchAll(PDO::FETCH_OBJ);
        		for($i = 0; $i < sizeof($assessments); ++$i)
                {
                     array_push($formdata->assessments, $assessments[$i]);
                }
        		$db = null;
        	} catch(PDOException $e) {
        		echo '{"error":{"text":'. $e->getMessage() .'}}';
        	}
      echo json_encode($formdata);
}

function addContact()  {
    $request = Slim::getInstance()->request();
    $session = json_decode($request->getBody());
    $contact_id = setContact($session->fname, $session->lname, $session->role);

    echo json_encode(getContact($contact_id));
}

function setContact($fname, $lname, $role)    {
    $sql = "INSERT INTO contacts (fname, lname, role) VALUES(:fname, :lname, :role)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("fname", $fname);
        $stmt->bindParam("lname", $lname);
        $stmt->bindParam("role", $role);
        $stmt->execute();
        return $db->lastInsertId();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateContact($id, $fname, $lname, $role)    {
    $sql = "UPDATE contacts SET fname=:fname, lname=:lname, role=:role WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->bindParam("fname", $fname);
        $stmt->bindParam("lname", $lname);
        $stmt->bindParam("role", $role);
        $stmt->execute();
        return $db->lastInsertId();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addSession() {
	$request = Slim::getInstance()->request();
	$session = json_decode($request->getBody());

    //set the main contact
    $contact_id = setContact($session->main_contact_fname, $session->main_contact_lname, $session->main_contact_role);

    // insert the new session
	$sql = "INSERT INTO sessions (status, company, company_size, company_industry, modified, main_contact, interviewees, assessment_id) VALUES (:status, :company, :company_size, :company_industry, :modified, :main_contact, :interviewees, :assessment_id)";
                try {
                    $db = getConnection();
                    $stmt = null;
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam("status", $session->status);
                    $stmt->bindParam("company", $session->company);
                    $stmt->bindParam("company_size", $session->company_size);
                    $stmt->bindParam("company_industry", $session->company_industry);
                    $stmt->bindParam("modified", $session->modified);
                    $stmt->bindParam("main_contact", $contact_id);
                    $stmt->bindParam("interviewees", $contact_id);
                    $stmt->bindParam("assessment_id", $session->assessment_id);
                    $stmt->execute();
                    $session->id = $db->lastInsertId();
                    echo json_encode($session);
                    $db = null;


                } catch(PDOException $e) {
                    echo '{"error":{"text":'. $e->getMessage() .'}}';
                }

}

function updateSession($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$session = json_decode($body);

    updateContact($session->main_contact, $session->main_contact_fname, $session->main_contact_lname, $session->main_contact_role);

	$sql = "UPDATE sessions SET status=:status, company=:company, company_size=:company_size, company_industry=:company_industry, modified=:modified, main_contact=:main_contact, interviewees=:interviewees, assessment_id=:assessment_id, responses=:responses WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $session->id);
                            $stmt->bindParam("status", $session->status);
                            $stmt->bindParam("company", $session->company);
                            $stmt->bindParam("company_size", $session->company_size);
                            $stmt->bindParam("company_industry", $session->company_industry);
                             $stmt->bindParam("modified", $session->modified);
                            $stmt->bindParam("main_contact", $session->main_contact);
                            $stmt->bindParam("interviewees", $session->interviewees);
                            $stmt->bindParam("assessment_id", $session->assessment_id);
                            $stmt->bindParam("responses", $session->responses);
		$stmt->execute();
		$db = null;
		echo json_encode($session);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function deleteSession($id) {
	$sql = "DELETE FROM session WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM session WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$sessions = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($sessions);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getResults($assessment) {
    $sql = "SELECT * FROM results WHERE assessment=:assessment";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("assessment", $assessment);
        $stmt->execute();
        $results = $stmt->fetchObject();
        $db = null;

        $res = new stdClass();
        $res->id = $results->id;
        $res->assessment = $results->assessment;

        //sections
        $res->sections = array();
        $sql = "SELECT * FROM result_sections WHERE id IN ($results->sections)";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $sects = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        for($i = 0; $i < sizeof($sects); ++$i)
        {
            array_push($res->sections, $sects[$i]);
        }

        //feedback
        $res->feedback = array();
        $sql = "SELECT * FROM feedback WHERE id IN ($results->feedback)";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $feeds = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        for($i = 0; $i < sizeof($feeds); ++$i)
        {
            array_push($res->feedback, $feeds[$i]);
        }

        echo json_encode($res);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="kensonge";
	$dbpass="Superpassword1!";
	$dbname="kensonge_cisco_byod";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>