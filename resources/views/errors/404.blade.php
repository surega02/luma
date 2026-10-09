@include('errors._status', [
    'code' => '404',
    'sr' => 'page not found',
    'heading' => "This page isn't filed anywhere.",
    'body' => 'The link may point to a record that was deleted, moved to Trash, or mistyped. Nothing here matches.',
])
