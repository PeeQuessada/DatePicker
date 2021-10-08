import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import {OmniscriptActionCommonUtil} from 'vlocity_cmt/omniscriptActionUtils';

import { getResourceUrl } from "vlocity_cmt/salesforceUtils";
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';


export default class solarCustomDataPicker extends OmniscriptBaseMixin(LightningElement) {
    
    @api nameField = "";
    @track value = "";
    @track valor;
    @api options;
    @api value;

    omniJsonData;
    newOptions;

    loadStaticScripts() {
        return getResourceUrl({
          //resourceName: "JQuery2021" 
          resourceName: "jsMoment"
        }).then(resourceUrl => {
            console.log('resourceURL', resourceUrl);
          if (resourceUrl) {
            loadScript(this,resourceUrl)
            .then(() => {
                console.log('entrou no then')
                const today = moment();
                console.log('entrou no then2 ', today)
            });
            
          }

        })
    }

    connectedCallback() {
        this.loadStaticScripts();
    }

    removeDates() {
        try{
            let input = $('myDatePicker');
            console.log('entrou ', input)
            var array = ["2021-10-14","2021-10-15","2021-10-16"]
 
            $('myDatePicker').datepicker({
                beforeShowDay: function(date){
                    var string = jQuery.datepicker.formatDate('dd-mm-yy', date);
                    return [ array.indexOf(string) == -1 ]
                }
            });
            console.log('final')
        } catch(error) {
            console.log('error ', error);
            
        }
        
    }

    get validDates() {
        let validDates = [];

        if(!this.options) {
            return [];
        }
        
        for(let i = 0; i< this.options.length; i++) {
            validDates.push({
                label: this.options[i], value: this.options[i]
            })
        }

        return validDates;
    }



}