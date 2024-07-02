<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;

class AuditsExport implements FromArray, WithHeadings, ShouldAutoSize, WithEvents
{
    /**
     * @return \Illuminate\Support\Collection
     */
    function array(): array
    {
        $audits = \OwenIt\Auditing\Models\Audit::with('user')
                ->orderBy('created_at', 'desc')                
                ->get();

        if ($audits->isNotEmpty()) {
            foreach ($audits as $audits_data) {

                $item['event'] = $audits_data->event;
                $user = User::where('id', $audits_data->user_id)
                ->first();
                $item['user_id'] = $user->username;
                $item['auditable_id'] = $audits_data->auditable_id;
                $item['auditable_type'] = $audits_data->auditable_type;
                $item['old_values'] = $audits_data->old_values;
                $item['new_values'] = $audits_data->new_values;
                $item['url'] = $audits_data->url;
                $item['created_at'] = date('d/m/y H:m:s',strtotime($audits_data->created_at));
                $data[] = $item;
            }
        } else {
            $data = [];
        }

        return $data;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $cellRange = 'A1:E1'; // All headers
                $event->sheet->getDelegate()->getStyle($cellRange)->getFont()->setSize(14);

                $styleArray = [
                    'borders' => [
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THICK,
                            'color' => ['argb' => 'FFFF0000'],
                        ],
                    ],

                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT,
                    ],
                ];

            },
        ];

    }

    public function headings(): array
    {
        return [
            'Event',
            'User',
            'Auditable id',
            'Auditable tipo',
            'Valor anterior',
            'Valor nuevo',
            'Url',
            'Fecha',
        ];
    }
}
