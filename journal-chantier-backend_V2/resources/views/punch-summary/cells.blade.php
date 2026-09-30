{{-- Colonnes chiffrées d'une ligne (chantier ou TOTAL) — taux arrondis à l'unité comme dans le cahier des charges --}}
<td>{{ $line['normal_hours'] + 0 }}</td>
<td>{{ $line['overtime_hours'] + 0 }}</td>
<td>{{ $line['total_hours'] + 0 }}</td>
<td>{{ round($line['overtime_rate']) }}%</td>
<td>{{ $line['workforce'] }}</td>
<td>{{ $line['mod'] }}</td>
<td>{{ $line['moi'] }}</td>
<td>{{ round($line['moi_rate']) }}%</td>
@foreach ($trades['mod'] as $trade)
    <td>{{ $line['mod_detail'][$trade] }}</td>
@endforeach
@foreach ($trades['moi'] as $trade)
    <td>{{ $line['moi_detail'][$trade] }}</td>
@endforeach
