import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor() { }

  // date (mm/dd/yyyy)
	reformatDate(date){
		var res = "";
		// Year
		res += date[6];
		res += date[7];
		res += date[8];
		res += date[9];
		res += "-"
		// Month
		res += date[0];
		res += date[1];
		res += "-"
		// Day
		res += date[3];
		res += date[4];
		// Time
		res += "T00:00:00Z"
		return res;
	}

}
