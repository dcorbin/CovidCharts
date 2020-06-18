import {createQuickPicks, NON_RESIDENT_CODE, UNKNOWN_CODE} from "./GeorgiaByCounty";
import React from 'react'
import {GA_URL} from './GA.svg-map'

export class CountyRegionSpec {
    constructor() {
        this.singleNoun = 'county'
        this.pluralNoun = 'counties'

        this.mapURI = GA_URL

        this.matrixMapRatio = [7, 3]
        this.columns=7
        this.minimumCellWidth = 107
        this.quickPicks = createQuickPicks()

        this.displayNameFor = function(region) {
            if (region === NON_RESIDENT_CODE) {
                return <i>Non-resident</i>
            }
            if (region === UNKNOWN_CODE) {
                return <i>Unknown</i>
            }
            return region
        }
    }
}
