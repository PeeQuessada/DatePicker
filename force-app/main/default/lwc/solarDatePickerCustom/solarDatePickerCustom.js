import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import {OmniscriptActionCommonUtil} from 'vlocity_cmt/omniscriptActionUtils';

import { getResourceUrl } from "vlocity_cmt/salesforceUtils";
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';


export default class solarCustomDataPicker extends OmniscriptBaseMixin(LightningElement) {

    hasMomentJs = false;

    connectedCallback() {
        this.loadStaticScripts();
    }

    today;
    lastClass;
    @track dateContext;
    @track selectedDate;
    @track dates = [];
    @track availableDates = [];

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

    // Carregar datas

    refreshDateNodes() {
        this.dates = [];
        const currentMoment = moment(this.dateContext);
        // startOf mutates moment, hence clone before use
        const start = this.dateContext.clone().startOf('month');
        console.log('start ', start)
        const startWeek = start.isoWeek() + 1;
        console.log('startWeek ', startWeek)
        // months do not always have the same number of weeks. eg. February
        const numWeeks = moment.duration(currentMoment.endOf('month') - start).weeks() + 1;
        console.log('numWeeks ', numWeeks)
        let weeks = [];

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

                    let availableDate = {
                        className,
                        formatted: day.format('YYYY-MM-DD'),
                        text: day.format('DD')
                    };

                    this.dates.push(availableDate);
                });
        }

        for(let i = 0; i < this.dates.length; i++) {
            let auxDay = this.dates[i];

            if(i < 7) {
                if (i == 0) {
                    weeks = [[auxDay]];
                    continue;
                }
                weeks[0].push(auxDay);
            } else if (i < 14) {
                if (i == 7) {
                    weeks.push([auxDay]);
                    continue;
                }
                weeks[1].push(auxDay);
            } else if (i < 21) {
                if (i == 14) {
                    weeks.push([auxDay]);
                    continue;
                }
                weeks[2].push(auxDay);
            } else if (i < 28) {
                if (i == 21) {
                    weeks.push([auxDay]);
                    continue;
                }
                weeks[3].push(auxDay);
            } else if(i < 35) {
                if (i == 28) {
                    weeks.push([auxDay]);
                    continue;
                }
                weeks[4].push(auxDay);
            } else {
                if (i == 35) {
                    weeks.push([auxDay]);
                    continue;
                }
                weeks[5].push(auxDay);
            }

        }

        this.availableDates = weeks;
        console.log('week 1 ', JSON.stringify(weeks[0]))
        console.log('week 2 ', JSON.stringify(weeks[1]))
        console.log('week 3 ', JSON.stringify(weeks[2]))
        console.log('week 4 ', JSON.stringify(weeks[3]))
        console.log('week 5 ', JSON.stringify(weeks[4]))
        console.log('week 6 ', JSON.stringify(weeks[5]))
    }

    loadStaticScripts() {
        return getResourceUrl({
          //resourceName: "JQuery2021" 
          resourceName: "jsMoment"
        }).then(resourceUrl => {
          if (resourceUrl) {
            loadScript(this,resourceUrl)
            .then(() => {
                this.hasMomentJs = true;
                this.today = moment();
                this.dateContext = moment();
                this.selectedDate = moment();
                this.refreshDateNodes();
            });
          }

        })
    }

    // Funcoes referente a tela
    @track showCalendar = false;
    handleCalendar() {
        this.showCalendar = !this.showCalendar;
    }
}