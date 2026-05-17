package com.ucb.ecollajta.common;

import com.ucb.ecollajta.model.Event;
import com.ucb.ecollajta.model.EventStatus;
import com.ucb.ecollajta.model.CommunityPost;
import com.ucb.ecollajta.repository.events.EventRepository;
import com.ucb.ecollajta.repository.community.CommunityPostRepository;
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
    private final CommunityPostRepository communityPostRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Seed Events
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

            // Seed Community Posts
            if (communityPostRepository.count() == 0) {
                log.info("Seeding default community posts into Neon PostgreSQL...");

                CommunityPost post1 = new CommunityPost(
                    null,
                    "Alcaldía de Cochabamba",
                    "Gobierno Autónomo Municipal",
                    "account_balance",
                    false,
                    "HACE 2 HORAS",
                    "OFICIAL",
                    "feed-official",
                    "¡Nuevos contenedores de reciclaje diferenciado en el centro histórico! Estamos instalando 50 puntos nuevos para facilitar la separación de residuos sólidos, orgánicos y plásticos.",
                    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
                    342,
                    48,
                    false
                );

                CommunityPost post2 = new CommunityPost(
                    null,
                    "Dra. Maria Elena",
                    "Líder Recoleta",
                    "https://i.pravatar.cc/150?img=47",
                    true,
                    "HACE 5 HORAS",
                    "COMUNIDAD",
                    "feed-community",
                    "Tips de Reciclaje: Composta Casera. ¿Sabías que el 40% de nuestra basura diaria es orgánica? Aquí te dejo 3 pasos simples para empezar tu propia compostera urbana sin olores:\n1. Usa un balde con tapa y pequeños orificios laterales.\n2. Alterna capas 'verdes' (restos de verdura) con 'marrones' (cartón seco).\n3. Revuelve una vez por semana para airear.",
                    null,
                    1200,
                    156,
                    true
                );

                communityPostRepository.saveAll(List.of(post1, post2));
                log.info("Default community posts successfully seeded!");
            } else {
                log.info("Community posts already present in database (count: {}). Skipping seeding.", communityPostRepository.count());
            }

        } catch (Exception e) {
            log.error("Error seeding database: {}", e.getMessage(), e);
        }
    }
}
