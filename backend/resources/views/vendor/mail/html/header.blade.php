<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://mueblesluxury.com.co/frontend/assets/img/logo-01.png" class="logo" alt="Paraiso Logo">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
