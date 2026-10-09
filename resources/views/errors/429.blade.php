@include('errors._status', [
    'code' => '429',
    'sr' => 'too many requests',
    'heading' => "That's a lot of attempts.",
    'body' => 'You’ve tried to sign in several times in a row. Wait about a minute, then try again.',
    'primary_label' => 'TRY AGAIN',
    'primary_href' => '/login',
])
