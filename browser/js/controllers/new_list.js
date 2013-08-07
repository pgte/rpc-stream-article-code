global.NewListCtrl = NewListCtrl;

function NewListCtrl($http, $location) {

	$http.post('/lists/new').success(onSaved);

	function onSaved(id) {
		$location.path('/lists/' + id);
	}
}