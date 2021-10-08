import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import {OmniscriptActionCommonUtil} from 'vlocity_cmt/omniscriptActionUtils';

import { getResourceUrl } from "vlocity_cmt/salesforceUtils";
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';


export default class solarCustomDataPicker extends OmniscriptBaseMixin(LightningElement) {

    today;

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
                this.today = today;
                console.log('entrou no then2 ', today)
                this.dateContext = moment();
                this.selectedDate = moment();
                this.refreshDateNodes();
            });
          }

        })
    }

    connectedCallback() {
        this.loadStaticScripts();
    }

    lastClass;
    @track dateContext;
    @track selectedDate;
    @track dates = [];

    get formattedSelectedDate() {
        if(!this.selectedDate) {
            return;
        }
        
        return this.selectedDate.format('YYYY-MM-DD');
    }
    get year() {
        if(!this.dateContext) {
            return;
        }

        return this.dateContext.format('Y');
    }
    get month() {
        if(!this.dateContext) {
            return;
        }

        return this.dateContext.format('MMMM');
    }

    previousMonth() {
        if(!this.dateContext) {
            return;
        }

        this.dateContext = moment(this.dateContext).subtract(1, 'month');
        this.refreshDateNodes();
    }

    nextMonth() {
        if(!this.dateContext) {
            return;
        }

        this.dateContext = moment(this.dateContext).add(1, 'month');
        this.refreshDateNodes();
    }

    goToday() {
        if(!this.hasMomentJs) {
            return;
        }

        this.selectedDate = this.today;
        this.dateContext = this.today;
        this.refreshDateNodes();
    }

    @api
    setSelected(e) {
        if(!this.hasMomentJs) {
            return;
        }

        const selectedDate = this.template.querySelector('.selected');
        if (selectedDate) {
            selectedDate.className = this.lastClass;
        }

        const { date } = e.target.dataset;
        this.selectedDate = moment(date);
        this.dateContext = moment(date);
        this.lastClass = e.target.className;
        e.target.className = 'selected';
    }

    refreshDateNodes() {
        this.dates = [];
        const currentMoment = moment(this.dateContext);
        // startOf mutates moment, hence clone before use
        const start = this.dateContext.clone().startOf('month');
        const startWeek = start.isoWeek();
        // months do not always have the same number of weeks. eg. February
        const numWeeks =
            moment.duration(currentMoment.endOf('month') - start).weeks() + 1;
        for (let week = startWeek; week <= startWeek + numWeeks; week++) {
            Array(7)
                .fill(0)
                .forEach((n, i) => {
                    const day = currentMoment
                        .week(week)
                        .startOf('week')
                        .clone()
                        .add(n + i, 'day');
                    let className = '';
                    if (day.month() === this.dateContext.month()) {
                        if (day.isSame(this.today, 'day')) {
                            className = 'today';
                        } else if (day.isSame(this.selectedDate, 'day')) {
                            className = 'selected';
                        } else {
                            className = 'date';
                        }
                    } else {
                        className = 'padder';
                    }
                    this.dates.push({
                        className,
                        formatted: day.format('YYYY-MM-DD'),
                        text: day.format('DD')
                    });
                });
        }
    }

    hasMomentJs() {
        try{
            let m = moment();
            return true;
        } catch(e) {
            return false;
        }
    }
}