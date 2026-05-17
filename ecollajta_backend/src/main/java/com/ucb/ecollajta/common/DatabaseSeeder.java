package com.ucb.ecollajta.common;

import com.ucb.ecollajta.model.Event;
import com.ucb.ecollajta.model.EventStatus;
import com.ucb.ecollajta.repository.events.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final EventRepository eventRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            if (eventRepository.count() == 0) {
                log.info("Seeding default events into Neon PostgreSQL...");

                Event event1 = Event.builder()
                    .title("Reforestación Urbana Sector Norte")
                    .description("Únete a la gran plantación de árboles en la zona norte de Cochabamba para reforestar nuestros parques y pulmones urbanos. Trae ropa cómoda y tu propia pala de jardín.")
                    .locationName("Sector Norte, Cochabamba")
                    .startsAt(LocalDateTime.of(2026, 8, 24, 8, 0))
                    .endsAt(LocalDateTime.of(2026, 8, 24, 13, 0))
                    .pointsReward(500)
                    .status(EventStatus.published)
                    .latitude(new BigDecimal("-17.385150"))
                    .longitude(new BigDecimal("-66.155700"))
                    .build();

                Event event2 = Event.builder()
                    .title("Brigada Vidrio 2.0")
                    .description("Campaña de recolección y reciclaje de botellas de vidrio en el casco viejo de la ciudad. Trae tus botellas de vidrio y gana puntos de recompensa por cada kilogramo.")
                    .locationName("OTB Centro Histórico")
                    .startsAt(LocalDateTime.of(2026, 10, 14, 9, 30))
                    .endsAt(LocalDateTime.of(2026, 10, 14, 16, 0))
                    .pointsReward(350)
                    .status(EventStatus.published)
                    .latitude(new BigDecimal("-17.393500"))
                    .longitude(new BigDecimal("-66.156800"))
                    .build();

                Event event3 = Event.builder()
                    .title("Taller Compostaje Comunitario")
                    .description("Aprende a transformar tus residuos orgánicos en abono natural para tus plantas en nuestro taller mensual. Te regalaremos un kit iniciador de compostaje.")
                    .locationName("OTB Sur Moderno")
                    .startsAt(LocalDateTime.of(2026, 10, 16, 10, 0))
                    .endsAt(LocalDateTime.of(2026, 10, 16, 12, 30))
                    .pointsReward(400)
                    .status(EventStatus.published)
                    .latitude(new BigDecimal("-17.412100"))
                    .longitude(new BigDecimal("-66.143200"))
                    .build();

                Event event4 = Event.builder()
                    .title("Limpieza Río Rocha")
                    .description("Acción de recolección de residuos sólidos en las orillas de nuestro emblemático Río Rocha. Ayúdanos a descontaminar y embellecer la cuenca.")
                    .locationName("Puente Cala Cala, Río Rocha")
                    .startsAt(LocalDateTime.of(2026, 11, 5, 8, 30))
                    .endsAt(LocalDateTime.of(2026, 11, 5, 12, 0))
                    .pointsReward(600)
                    .status(EventStatus.published)
                    .latitude(new BigDecimal("-17.378900"))
                    .longitude(new BigDecimal("-66.159200"))
                    .build();

                eventRepository.saveAll(List.of(event1, event2, event3, event4));
                log.info("Default events successfully seeded!");
            } else {
                log.info("Events already present in database (count: {}). Skipping seeding.", eventRepository.count());
            }
        } catch (Exception e) {
            log.error("Error seeding default events: {}", e.getMessage(), e);
        }
    }
}
