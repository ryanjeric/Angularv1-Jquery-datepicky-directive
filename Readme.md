AUTHOR :RYANJERIC
DATEPICKY USING UI JQUERY DATEPICKER
(NO ANIMALS WERE HARMED IN THE MAKING OF THIS DIRECTIVE.)

DESCRIPTION & FEATURES 
Be able to input manually or select from calendar
Calendar should be triggered when an icon beside the input is clicked

Date Required Rules:
-Required full date
-Required even just month or year( SET allowIncomplete in config  )
-Required even year( SET allowIncomplete in config  )
* WITH MASKING FUNCTION and Validations using angular directives.

DEPENDENCIPIES
 * JQUERY (Masking / Datepicker) http://api.jqueryui.com/datepicker/
 * ANGULAR 1 (Any version maybe?)
 * JQUERYUI-CSS (assets/css/less/custom/datepicky.less)

Datepicky Template :
 - /scripts/directives/datepicker/datepicky/datepicky.tpl.html

USAGE AND SPAGHETTI :

<date-picky
    ng-model="sample"
    name="samplename"
    txtbox-id="sampleid"
    config="{ placeholder : 'mm/dd/yyyy' }"
    on-date-change="foo(bar)"
    on-date-blur="bar(foo)"
    on-date-keypress="na(ni)"
></date-picky>

OPTIONS

[REQUIRED]
 ng-model  = STRING
 ng-required = bool
 name      = STRING
 txtbox-id = STRING
 config    = OBJECT (config="{ placeholder : 'mm/dd/yyyy' }")
 ng-disabled = BOOL (MANUAL THINGY)

[OPTIONAL]
 on-date-change = function inside parent controller (act like ng-change)
 on-date-blur = function inside parent controller
 on-date-keypress = function inside parent controller
 input-style = ng-style format (GOOGLE (GMB) NGstyle for more info)
 mirror-date = copy other model's value
##WE CAN ADD MORE OPTIONS HERE

 Config Options ( theres a bug here... if you accept boolean value the datepicker will keep parsing to date )
 * placeholder : Strings like ('mm/dd/yyyy' / 'Birthday' / 'Birthdate')
 - disable: Bool (Disable function has been disabled dont use.)
 * min : String date in 'mm/dd/yyyy' format
 * max : String date in  'mm/dd/yyyy' format
 * allowIncomplete : String fixedvalue to 'true' (FOR OPTIONAL FIELDS) // IF THIS NOT EXIST on your config Your Date should be complete....
 * noformat -( Special case Medication dates )
 - WE CAN ADD MORE STUFF HERE

############################################
 THERE ARE LOTS OF LOTS OF LOTS OF LOTS OF IMPROVEMENT TO DO HERE
 QUESTION  /  SUGGESTIONS talk to RYANJERIC [https://www.facebook.com/RyAnJeRiC/]

 TODOS
 - Add ng-style option - DONE
 - config min / max  - DONE
 - MINMAX auto Format date - DONE
-  Added name selector to avoid disable other datepicker's btnImage - DONE
###########################################
