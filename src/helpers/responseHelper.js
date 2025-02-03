export class SuccessResponse {
	data;
	isSuccess = true;
	status = 200;
	message;
	total;

	constructor(data, message, total) {
		this.data = data;
		this.total = total;
		this.message = message;
	}
}

export class ErrorResponse {
	isSuccess = false;
	status;
	message;

	constructor(_status, message) {
		this.status = _status;
		this.message = message;
	}
}
