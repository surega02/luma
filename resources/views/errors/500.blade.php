@include('errors._status', [
    'code' => '500',
    'sr' => 'server error',
    'heading' => 'Something went wrong on our side.',
    'body' => "The request didn't complete. Reload in a moment — if it keeps happening, the problem is with Luma, not your input.",
])
