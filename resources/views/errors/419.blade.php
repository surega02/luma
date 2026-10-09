@include('errors._status', [
    'code' => '419',
    'sr' => 'session expired',
    'heading' => 'Your session expired.',
    'body' => 'This tab sat too long before submitting. Reload the page to start fresh, then try again.',
    'primary_label' => 'RELOAD',
    'primary_href' => '',
])
