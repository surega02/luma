@include('errors._status', [
    'code' => '403',
    'sr' => 'access denied',
    'heading' => "You can't open this record.",
    'body' => 'It belongs to another account, or your access to it has been removed.',
])
