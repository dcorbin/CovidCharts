import {createQuickPicks, NON_RESIDENT_CODE, UNKNOWN_CODE} from "./GeorgiaByCounty";
import React from 'react'
import {GA_URL} from './GA.svg-map'

export class CountyRegionSpec {
    constructor() {
        this.singleNoun = 'county'
        this.pluralNoun = 'counties'
        this.displayNameFor = function(region) {
            if (region === NON_RESIDENT_CODE) {
                return <i>Non-resident</i>
            }
            if (region === UNKNOWN_CODE) {
                return <i>Unknown</i>
            }
            return region
        }
        this.quickPicks = createQuickPicks()
        this.mapURI = GA_URL
    }
}